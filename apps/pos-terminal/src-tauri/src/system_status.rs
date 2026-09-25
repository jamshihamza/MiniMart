use serde::Serialize;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct EndpointReply {
    status_code: Option<u32>,
    body: Option<String>,
}

impl EndpointReply {
    fn unavailable() -> Self {
        Self {
            status_code: None,
            body: None,
        }
    }

    fn from_result(result: Result<(u32, String), String>) -> Self {
        match result {
            Ok((status_code, body)) => Self {
                status_code: Some(status_code),
                body: Some(body),
            },
            Err(_error) => Self::unavailable(),
        }
    }
}

#[derive(Serialize)]
pub struct SystemStatusProbe {
    health: EndpointReply,
    readiness: EndpointReply,
}

impl SystemStatusProbe {
    fn unavailable() -> Self {
        Self {
            health: EndpointReply::unavailable(),
            readiness: EndpointReply::unavailable(),
        }
    }
}

#[tauri::command]
pub async fn check_store_node() -> SystemStatusProbe {
    tauri::async_runtime::spawn_blocking(probe)
        .await
        .unwrap_or_else(|_| SystemStatusProbe::unavailable())
}

#[cfg(not(windows))]
fn probe() -> SystemStatusProbe {
    SystemStatusProbe::unavailable()
}

#[cfg(windows)]
fn probe() -> SystemStatusProbe {
    use url::Url;

    let Ok(endpoint) = std::env::var("MINIMART_STORE_NODE_HTTPS_URL") else {
        return SystemStatusProbe::unavailable();
    };
    let Ok(thumbprint) = std::env::var("MINIMART_POS_DEVICE_CERT_SHA1") else {
        return SystemStatusProbe::unavailable();
    };
    let Ok(url) = Url::parse(&endpoint) else {
        return SystemStatusProbe::unavailable();
    };
    if url.scheme() != "https"
        || url.host_str().is_none()
        || url.username() != ""
        || url.password().is_some()
        || url.path() != "/"
        || url.query().is_some()
        || url.fragment().is_some()
    {
        return SystemStatusProbe::unavailable();
    }
    let Some(port) = url.port_or_known_default() else {
        return SystemStatusProbe::unavailable();
    };
    let Some(sha1) = parse_sha1(&thumbprint) else {
        return SystemStatusProbe::unavailable();
    };
    let host = url.host_str().unwrap_or_default();
    SystemStatusProbe {
        health: EndpointReply::from_result(winhttp_get(host, port, "/api/v1/system/health", &sha1)),
        readiness: EndpointReply::from_result(winhttp_get(
            host,
            port,
            "/api/v1/system/readiness",
            &sha1,
        )),
    }
}

#[cfg(windows)]
fn parse_sha1(value: &str) -> Option<[u8; 20]> {
    let hex: String = value
        .chars()
        .filter(|character| *character != ':')
        .collect();
    if hex.len() != 40 {
        return None;
    }
    let mut result = [0u8; 20];
    for (index, byte) in result.iter_mut().enumerate() {
        *byte = u8::from_str_radix(&hex[index * 2..index * 2 + 2], 16).ok()?;
    }
    Some(result)
}

#[cfg(windows)]
fn winhttp_get(
    host: &str,
    port: u16,
    path: &str,
    sha1: &[u8; 20],
) -> Result<(u32, String), String> {
    use std::{
        ffi::c_void,
        mem::size_of,
        ptr::{null, null_mut},
    };
    use windows::Win32::Networking::WinHttp::{
        WINHTTP_ACCESS_TYPE_NO_PROXY, WINHTTP_FLAG_SECURE, WINHTTP_OPTION_CLIENT_CERT_CONTEXT,
        WINHTTP_QUERY_FLAG_NUMBER, WINHTTP_QUERY_STATUS_CODE, WinHttpCloseHandle, WinHttpConnect,
        WinHttpOpen, WinHttpOpenRequest, WinHttpQueryHeaders, WinHttpReadData,
        WinHttpReceiveResponse, WinHttpSendRequest, WinHttpSetOption, WinHttpSetTimeouts,
    };
    use windows::Win32::Security::Cryptography::{
        CERT_CONTEXT, CERT_FIND_SHA1_HASH, CRYPT_INTEGER_BLOB, CertCloseStore,
        CertFindCertificateInStore, CertFreeCertificateContext, CertOpenSystemStoreW,
        PKCS_7_ASN_ENCODING, X509_ASN_ENCODING,
    };
    use windows::core::{PCWSTR, w};

    struct HttpHandle(*mut c_void);
    impl Drop for HttpHandle {
        fn drop(&mut self) {
            if !self.0.is_null() {
                let _ = unsafe { WinHttpCloseHandle(self.0) };
            }
        }
    }

    let wide = |text: &str| {
        text.encode_utf16()
            .chain(std::iter::once(0))
            .collect::<Vec<u16>>()
    };
    let host_wide = wide(host);
    let path_wide = wide(path);
    let session = HttpHandle(unsafe {
        WinHttpOpen(
            w!("MiniMart POS MM-006"),
            WINHTTP_ACCESS_TYPE_NO_PROXY,
            PCWSTR::null(),
            PCWSTR::null(),
            0,
        )
    });
    if session.0.is_null() {
        return Err("WinHTTP session failed".into());
    }
    unsafe { WinHttpSetTimeouts(session.0, 3_000, 3_000, 3_000, 3_000) }
        .map_err(|_| "WinHTTP timeout setup failed")?;
    let connection =
        HttpHandle(unsafe { WinHttpConnect(session.0, PCWSTR(host_wide.as_ptr()), port, 0) });
    if connection.0.is_null() {
        return Err("WinHTTP connection failed".into());
    }
    let request = HttpHandle(unsafe {
        WinHttpOpenRequest(
            connection.0,
            w!("GET"),
            PCWSTR(path_wide.as_ptr()),
            PCWSTR::null(),
            PCWSTR::null(),
            null(),
            WINHTTP_FLAG_SECURE,
        )
    });
    if request.0.is_null() {
        return Err("WinHTTP request failed".into());
    }

    let store = unsafe { CertOpenSystemStoreW(None, w!("MY")) }
        .map_err(|_| "Windows device certificate store unavailable")?;
    let mut sha1_bytes = *sha1;
    let hash = CRYPT_INTEGER_BLOB {
        cbData: sha1_bytes.len() as u32,
        pbData: sha1_bytes.as_mut_ptr(),
    };
    let certificate = unsafe {
        CertFindCertificateInStore(
            store,
            X509_ASN_ENCODING | PKCS_7_ASN_ENCODING,
            0,
            CERT_FIND_SHA1_HASH,
            Some((&raw const hash).cast()),
            None,
        )
    };
    if certificate.is_null() {
        let _ = unsafe { CertCloseStore(Some(store), 0) };
        return Err("Enrolled device certificate missing".into());
    }
    let context =
        unsafe { std::slice::from_raw_parts(certificate.cast::<u8>(), size_of::<CERT_CONTEXT>()) };
    let result = unsafe {
        WinHttpSetOption(
            Some(request.0.cast_const()),
            WINHTTP_OPTION_CLIENT_CERT_CONTEXT,
            Some(context),
        )
    };
    let _ = unsafe { CertFreeCertificateContext(Some(certificate)) };
    let _ = unsafe { CertCloseStore(Some(store), 0) };
    result.map_err(|_| "Windows device certificate rejected")?;

    unsafe { WinHttpSendRequest(request.0, None, None, 0, 0, 0) }
        .map_err(|_| "HTTPS request failed")?;
    unsafe { WinHttpReceiveResponse(request.0, null_mut()) }
        .map_err(|_| "HTTPS response failed")?;
    let mut status = 0u32;
    let mut status_size = size_of::<u32>() as u32;
    let mut index = 0u32;
    unsafe {
        WinHttpQueryHeaders(
            request.0,
            WINHTTP_QUERY_STATUS_CODE | WINHTTP_QUERY_FLAG_NUMBER,
            PCWSTR::null(),
            Some((&raw mut status).cast()),
            &mut status_size,
            &mut index,
        )
    }
    .map_err(|_| "HTTPS status unavailable")?;
    let mut body = Vec::new();
    loop {
        let mut chunk = [0u8; 4096];
        let mut read = 0u32;
        unsafe {
            WinHttpReadData(
                request.0,
                chunk.as_mut_ptr().cast(),
                chunk.len() as u32,
                &mut read,
            )
        }
        .map_err(|_| "HTTPS body unavailable")?;
        if read == 0 {
            break;
        }
        body.extend_from_slice(&chunk[..read as usize]);
        if body.len() > 16_384 {
            return Err("HTTPS body too large".into());
        }
    }
    let body = String::from_utf8(body).map_err(|_| "HTTPS body is not UTF-8")?;
    Ok((status, body))
}

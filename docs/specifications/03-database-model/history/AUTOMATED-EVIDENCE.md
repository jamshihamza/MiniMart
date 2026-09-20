# Automated Review Evidence

  Check                                          Result
  -------------------------------------------- --------
  Catalog table count                                74
  Reference DDL CREATE TABLE count                   30
  Missing DDL table definitions                      44
  Frozen decision seams                              60
  Explicit Decision IDs in DB seam treatment          0
  FK/reference lines in reference DDL                16
  Explicit composite tenant FK lines                  2

## Interpretation

These counts are evidence for review, not standalone correctness
judgments. The semantic findings in
`DATABASE-MODEL-DEEP-CONSISTENCY-REVIEW-v0.1.md` determine the freeze
gate.

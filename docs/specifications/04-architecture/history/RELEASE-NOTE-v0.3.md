# MiniMart Architecture Refinement v0.3 --- Release Note

v0.3 is the revised Architecture Freeze Candidate after the independent
final review of v0.2.

It closes all six final-review findings without changing frozen Domain
or Database semantics.

The release: - removes the cross-module internal-schema read
exception; - restores the complete approved technology baseline; - makes
edge/cloud one shared service runtime with mode-specific composition; -
restores the approved security implementation baseline; - restores
mandatory Phase-0 architecture risk spikes; - corrects provider
dependency/invocation diagram direction.

The earlier v0.2 candidate and its final-review evidence are preserved
under `history/`.

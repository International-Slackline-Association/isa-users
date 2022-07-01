| PK         | SK_GSI         | LSI | GSI_SK      | ...Attributes |
| ---------- | -------------- | --- | ----------- | ------------- |
| user:{id}  | userDetails    |     | userDetails | ...           |
| user:{id}  | club:{id}      |     | details     | ...           |
| club:{id}  | clubDetails    |     | clubDetails | ...           |
| isaMembers | member:{email} |

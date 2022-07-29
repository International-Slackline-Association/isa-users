| PK         | SK_GSI         | LSI | LSI_2 | GSI_SK        | GSI2 | GSI2_SK | ...Attributes |
| ---------- | -------------- | --- | ----- | ------------- | ---- | ------- | ------------- |
| user:{id}  | userDetails    |     |       | email:{email} |      |         | ...           |
| user:{id}  | club:{id}      |     |       | details       |      |         | ...           |
| club:{id}  | clubDetails    |     |       | email:{email} |      |         | ...           |
| isaMembers | member:{email} |     |       |               |      |         | ....          |

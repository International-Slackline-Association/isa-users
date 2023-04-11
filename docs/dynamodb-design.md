| PK               | SK_GSI      | LSI | LSI_2 | GSI_SK        | GSI2 | GSI2_SK | ...Attributes  |
| ---------------- | ----------- | --- | ----- | ------------- | ---- | ------- | -------------- |
| user:{id}        | userDetails |     |       | email:{email} |      |         | ...            |
| user:{id}        | org:{id}    |     |       | details       |      |         | ...            |
| org:{id}         | orgDetails  |     |       | email:{email} |      |         | ...            |
| genericHashes    | {hash}      |     |       |               |      |         | ddb_ttl, value |

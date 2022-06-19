| PK        | SK_GSI      | LSI | GSI_SK        | ...Attributes |
| --------- | ----------- | --- | ------------- | ------------- |
| user:{id} | userDetails |     |               | ...           |
| user:{id} | club:{id}   |     |               | ...           |
| club:{id} | clubDetails |     | email:{email} | ...           |

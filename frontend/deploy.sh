#!/bin/bash

npm run build
aws s3 sync dist/ s3://lehai-react-app-2609
aws cloudfront create-invalidation \
    --distribution-id E2V4FNTVAWV70J \
    --paths "/*"
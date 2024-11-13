#!/bin/bash
BUCKET_NAME="state.terraform.dev.microservices.connect.q4inc.com.us-east-1"
TARGET_DATE="2023-01-01" 

# List and delete objects older than TARGET_DATE
aws s3api list-objects-v2 --bucket $BUCKET_NAME \
  --query 'Contents[?LastModified<=`'"$TARGET_DATE"'` && !starts_with(Key, `environment/dev/`)].[Key, LastModified]' \
  --output text | 
while read -r OBJECT_KEY; do
    echo "Deleting $OBJECT_KEY..."
    # aws s3api delete-object --bucket $BUCKET_NAME --key "$OBJECT_KEY"
done

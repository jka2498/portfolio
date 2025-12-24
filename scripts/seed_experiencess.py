import json
from pathlib import Path

import boto3
from botocore.exceptions import ClientError

TABLE_NAME = "PortfolioExperiences"
SEED_FILE = Path(__file__).with_name("seed_experiences.json")

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)

def seed():
    experiences = json.loads(SEED_FILE.read_text(encoding="utf-8"))
    for exp in experiences:
        try:
            table.put_item(Item=exp)
            print(f"Inserted {exp['id']}")
        except ClientError as e:
            print(f"Failed to insert {exp['id']}: {e}")

if __name__ == "__main__":
    seed()

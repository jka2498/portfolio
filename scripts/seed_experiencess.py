import boto3
from botocore.exceptions import ClientError

TABLE_NAME = "PortfolioExperiences"

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)

experiences = [
    {
        "id": "exp-1",
        "role": "Software Engineer",
        "company": "Example Corp",
        "state": "RUNNING",
        "startYear": 2022
    },
    {
        "id": "exp-2",
        "role": "Backend Engineer",
        "company": "Another Co",
        "state": "STOPPED",
        "startYear": 2020
    }
]

def seed():
    for exp in experiences:
        try:
            table.put_item(Item=exp)
            print(f"Inserted {exp['id']}")
        except ClientError as e:
            print(f"Failed to insert {exp['id']}: {e}")

if __name__ == "__main__":
    seed()

import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from .config import MONGODB_URI

mongo_client = AsyncIOMotorClient(MONGODB_URI, tlsCAFile=certifi.where())
db = mongo_client.parentapp

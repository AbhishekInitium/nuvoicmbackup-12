
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import { IncentivePlan } from '@/types/incentiveTypes';

// Connection URI (should be moved to environment variables in production)
const uri = "mongodb+srv://abhishekbhate:OYtDAanU4lNezl76@cluster0.jmskiuq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// MongoDB client options
const clientOptions = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
};

// Create a MongoClient instance
const client = new MongoClient(uri, clientOptions);

// Database and collection names
const DB_NAME = 'incentiveDesigner';
const COLLECTION_NAME = 'incentiveSchemes';

/**
 * Connect to MongoDB
 */
export const connectToMongoDB = async (): Promise<MongoClient> => {
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB");
    return client;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
};

/**
 * Save an incentive scheme to MongoDB
 */
export const saveIncentiveScheme = async (scheme: IncentivePlan): Promise<string> => {
  try {
    // Connect to MongoDB
    await connectToMongoDB();
    
    // Generate timestamp for unique ID
    const timestamp = Date.now();
    const schemeName = scheme.name || 'Unnamed_Scheme';
    
    // Format the name with timestamp
    const formattedName = `${schemeName.replace(/\s+/g, '_')}_${timestamp}`;
    
    // Prepare the document to be saved
    const schemeDocument = {
      ...scheme,
      originalName: scheme.name,
      name: formattedName,
      createdAt: new Date(timestamp),
    };
    
    // Get the collection and insert the document
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    const result = await collection.insertOne(schemeDocument);
    
    console.log(`Saved scheme with ID: ${result.insertedId}`);
    return result.insertedId.toString();
  } catch (error) {
    console.error("Error saving incentive scheme to MongoDB:", error);
    throw error;
  }
};

/**
 * Get all incentive schemes from MongoDB
 */
export const getIncentiveSchemes = async (): Promise<any[]> => {
  try {
    // Connect to MongoDB
    await connectToMongoDB();
    
    // Get the collection and find all documents
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    const schemes = await collection.find({}).toArray();
    
    return schemes;
  } catch (error) {
    console.error("Error fetching incentive schemes from MongoDB:", error);
    return [];
  }
};

/**
 * Get a specific incentive scheme by ID
 */
export const getIncentiveSchemeById = async (id: string): Promise<any | null> => {
  try {
    // Connect to MongoDB
    await connectToMongoDB();
    
    // Get the collection and find the document by ID
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    const scheme = await collection.findOne({ _id: new ObjectId(id) });
    
    return scheme;
  } catch (error) {
    console.error(`Error fetching incentive scheme with ID ${id}:`, error);
    return null;
  }
};

/**
 * Close the MongoDB connection
 */
export const closeMongoDB = async (): Promise<void> => {
  try {
    await client.close();
    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
  }
};

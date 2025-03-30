
export const updateIncentiveScheme = async (schemeId: string, updates: Partial<IncentivePlan>, status?: string): Promise<boolean> => {
  try {
    console.log(`Creating new version for scheme ${schemeId}`);
    console.log('Updates:', JSON.stringify(updates, null, 2));
    
    const version = updates.metadata?.version || 1;
    
    const updatedScheme = {
      ...updates,
      schemeId: schemeId,
      metadata: {
        ...(updates.metadata || {}),
        createdAt: updates.metadata?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: version,
        status: status || updates.metadata?.status || 'DRAFT'
      }
    };
    
    console.log("Saving new version with metadata:", JSON.stringify(updatedScheme.metadata, null, 2));
    
    const response = await axios.post(`${API_BASE_URL}/${schemeId}/version`, updatedScheme);
    
    if (response.status === 201 && response.data._id) {
      console.log(`Successfully created new version with MongoDB ID: ${response.data._id}`);
      return true;
    } else {
      console.error("Failed to create new version: Unexpected response", response.status, response.data);
      return false;
    }
  } catch (error) {
    console.error(`Error creating new version of scheme ${schemeId}:`, error);
    throw new Error(`Failed to update scheme: ${error instanceof Error ? error.message : String(error)}`);
  }
};

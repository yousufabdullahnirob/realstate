export const DataAdapter = {
  adaptProject: (backendProject) => {
    return {
      id: backendProject.id,
      name: backendProject.name,
      location: backendProject.location,
      status: backendProject.status,
      image: backendProject.image || "",
      description: backendProject.description ? backendProject.description.split('\n\n') : [],
      land_area: backendProject.land_area,
      orientation: backendProject.orientation,
      parking: backendProject.parking,
      handover_date: backendProject.handover_date,
      features: backendProject.features ? backendProject.features.split(',').map(f => f.trim()) : [],
      extra_description: backendProject.extra_description ? backendProject.extra_description.split('\n\n') : [],
      total_floors: backendProject.total_floors,
      total_units: backendProject.total_units,
      launch_date: backendProject.launch_date,
    };
  },

  adaptApartment: (backendApt) => {
    return {
      id: backendApt.id,
      title: backendApt.title,
      price: `${parseInt(backendApt.price).toLocaleString()} BDT`,
      size: `${backendApt.floor_area_sqft || 'N/A'} sqft`,
      bedrooms: backendApt.bedrooms || '0',
      bathrooms: backendApt.bathrooms || '0',
      location: backendApt.location || 'Dhaka',
      image: backendApt.image || "",
      description: backendApt.description,
      project_id: backendApt.project,
    };
  }
};

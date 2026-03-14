export const PROJECTS_STORAGE_KEY = 'mahim_projects';

export const STATIC_PROJECTS = [
  {
    id: 1,
    name: 'Skyline Residence',
    area: 'Urban',
    priceRange: '$1M - $1.5M',
    size: '2,500 - 4,000 sq ft',
    shortDescription: 'Contemporary family villa with panoramic city views and open-plan living spaces.',
    status: 'Completed',
    createdDate: '2024-01-12',
    image: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 2,
    name: 'Palm Grove Townhouse',
    area: 'Suburban',
    priceRange: '$500k - $1M',
    size: '1,200 - 2,500 sq ft',
    shortDescription: 'A cluster of modern townhouses nestled within a private gated community.',
    status: 'Under Progress',
    createdDate: '2024-04-03',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 3,
    name: 'Coastal Penthouse',
    area: 'Coastal',
    priceRange: '$2M+',
    size: '4,000+ sq ft',
    shortDescription: 'Luxury residential penthouse with floor-to-ceiling ocean views and private terrace.',
    status: 'Future Project',
    createdDate: '2025-02-18',
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 4,
    name: 'Garden Retreat Villa',
    area: 'Garden',
    priceRange: '$500k - $1M',
    size: '1,200 - 2,500 sq ft',
    shortDescription: 'Peaceful family home surrounded by lush landscaped gardens and water features.',
    status: 'Completed',
    createdDate: '2023-11-27',
    image: 'https://images.unsplash.com/photo-1600566753052-3f5f4f0d8785?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 5,
    name: 'Marina Heights Apartment',
    area: 'Coastal',
    priceRange: '$1.5M - $2M',
    size: '2,500 - 4,000 sq ft',
    shortDescription: 'Upscale residential apartment with stunning marina views and premium finishes.',
    status: 'Under Progress',
    createdDate: '2025-01-09',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80'
  }
];

export const loadProjects = () => {
  try {
    const raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (!raw) {
      return STATIC_PROJECTS;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return STATIC_PROJECTS;
    }

    const fallbackAreaByName = {
      'Skyline Residence': 'Urban',
      'Palm Grove Townhouse': 'Suburban',
      'Coastal Penthouse': 'Coastal',
      'Garden Retreat Villa': 'Garden',
      'Marina Heights Apartment': 'Coastal'
    };

    const fallbackPriceByName = {
      'Skyline Residence': '$1M - $1.5M',
      'Palm Grove Townhouse': '$500k - $1M',
      'Coastal Penthouse': '$2M+',
      'Garden Retreat Villa': '$500k - $1M',
      'Marina Heights Apartment': '$1.5M - $2M'
    };

    const fallbackSizeByName = {
      'Skyline Residence': '2,500 - 4,000 sq ft',
      'Palm Grove Townhouse': '1,200 - 2,500 sq ft',
      'Coastal Penthouse': '4,000+ sq ft',
      'Garden Retreat Villa': '1,200 - 2,500 sq ft',
      'Marina Heights Apartment': '2,500 - 4,000 sq ft'
    };

    const cleanedProjectName = (projectName) => (projectName || '').replace(/\s*\(Edited\)$/i, '').trim();

    return parsed.map((project) => ({
      ...project,
      name: cleanedProjectName(project.name),
      area: project.area || fallbackAreaByName[cleanedProjectName(project.name)] || 'Urban',
      priceRange: project.priceRange || fallbackPriceByName[cleanedProjectName(project.name)] || '$500k - $1M',
      size: project.size || fallbackSizeByName[cleanedProjectName(project.name)] || '1,200 - 2,500 sq ft'
    }));
  } catch {
    return STATIC_PROJECTS;
  }
};

export const saveProjects = (projects) => {
  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  } catch {
    // no-op
  }
};
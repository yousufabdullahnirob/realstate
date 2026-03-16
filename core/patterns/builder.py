from core.models import Project, Apartment

class ProjectBuilder:
    def __init__(self):
        self._project_data = {}

    def set_name(self, name):
        self._project_data['name'] = name
        return self

    def set_location(self, location):
        self._project_data['location'] = location
        return self

    def set_description(self, description):
        self._project_data['description'] = description
        return self

    def set_stats(self, total_floors, total_units):
        self._project_data['total_floors'] = total_floors
        self._project_data['total_units'] = total_units
        return self

    def set_launch_date(self, launch_date):
        self._project_data['launch_date'] = launch_date
        return self

    def build(self):
        return Project.objects.create(**self._project_data)

class ApartmentBuilder:
    def __init__(self):
        self._apartment_data = {}
        self._project = None

    def set_project(self, project):
        self._project = project
        return self

    def set_details(self, title, description, location):
        self._apartment_data['title'] = title
        self._apartment_data['description'] = description
        self._apartment_data['location'] = location
        return self

    def set_specs(self, floor_area, price, bedrooms, bathrooms):
        self._apartment_data['floor_area_sqft'] = floor_area
        self._apartment_data['price'] = price
        self._apartment_data['bedrooms'] = bedrooms
        self._apartment_data['bathrooms'] = bathrooms
        return self

    def build(self):
        if self._project:
            return Apartment.objects.create(project=self._project, **self._apartment_data)
        return Apartment.objects.create(**self._apartment_data)

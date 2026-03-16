# Design Patterns Documentation

This document outlines the architectural design patterns implemented in this Real Estate platform to ensure modularity, scalability, and clean code principles.

---

## 1. Singleton Pattern (Database Connection)
- **File**: [singleton.py](file:///c:/Users/HP/realstate/core/patterns/singleton.py)
- **Purpose**: Ensures that only one instance of the database connection manager exists throughout the application lifecycle. This prevents redundant connection overhead and ensures resource efficiency.

### Implementation:
```python
class DatabaseConnection:
    _instance = None
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DatabaseConnection, cls).__new__(cls)
            if not connection.connection:
                connection.connect()
            cls._instance.connection = connection
        return cls._instance
```

---

## 2. Builder Pattern (Complex Object Creation)
- **File**: [builder.py](file:///c:/Users/HP/realstate/core/patterns/builder.py)
- **Purpose**: Provides a flexible way to construct complex `Project` and `Apartment` objects step-by-step. This decouples the construction of a complex object from its representation.

### Implementation:
```python
project = ProjectBuilder() \
    .set_name("Mahim Sky View") \
    .set_location("Banani") \
    .set_stats(20, 80) \
    .build()
```

---

## 3. Proxy Pattern (API Security & Access)
- **File**: [proxyClient.js](file:///c:/Users/HP/realstate/frontend/src/utils/proxyClient.js)
- **Purpose**: Acts as an intermediary for all API requests. It handles security concerns such as JWT token injection and centralized error handling, ensuring that RBAC is enforced for all client-to-server communication.

### Implementation:
```javascript
const apiProxy = {
  get: async (endpoint) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: getHeaders(), // Injects JWT token
    });
    return await response.json();
  }
};
```

---

## 4. Adapter Pattern (UI Data Formatting)
- **File**: [dataAdapter.js](file:///c:/Users/HP/realstate/frontend/src/utils/dataAdapter.js)
- **Purpose**: Decouples the frontend UI from the backend data structure. It transforms raw backend numerical data into human-readable strings (e.g., formatting price with "BDT" and commas).

### Implementation:
```javascript
adaptApartment: (backendApt) => {
  return {
    ...backendApt,
    price: `${parseInt(backendApt.price).toLocaleString()} BDT`,
    size: `${backendApt.floor_area_sqft || 'N/A'} sqft`,
  };
}
```

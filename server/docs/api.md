# API Documentation

## Base URL

### **`http://localhost:3000/api`**

All API requests are be made to http://localhost:3000/api

## Endpoints

### **Step Functions**

<details>
<summary>
<code>GET</code> <code>/step-functions</code> Gets all step functions 
previously stored in the database
</summary>

### Parameters

> None

### Responses

> | http code | content-type                     | response |
> | --------- | -------------------------------- | -------- |
> | `200`     | `application/json;charset=UTF-8` | JSON     |

### Example Responses

#### 200 Ok

```json
[
  {
    "step_function_id": 0,
    "name": "string",
    "description": "string",
    "definition": {}
  }
]
```

</details>

<details>
<summary>
<code>GET</code> <code>/step_functions/{step_function_id}</code> Get details 
for a specific step function by id - <b>Not Yet Implemented</b>
</summary>

### Parameters

> | name             | type     | data type   | description                                  |
> | ---------------- | -------- | ----------- | -------------------------------------------- |
> | step_function_id | required | integer > 0 | unique id associated with this step function |

### Responses

> | http code | content-type                     | response |
> | --------- | -------------------------------- | -------- |
> | `200`     | `application/json;charset=UTF-8` | JSON     |
> | `400`     | `application/json;charset=UTF-8` | JSON     |
> | `404`     | `application/json;charset=UTF-8` | JSON     |

### Example Responses

#### 200 Ok

```json
{
  "step_function_id": 0,
  "name": "string",
  "description": "string",
  "definition": {}
}
```

### Not Yet Implemented

#### 400 Invalid Step Function Id

```json
{ "error": "Invalid step_function_id" }
```

#### 404 Step Function Not Found

```json
{ "error": "No step function found" }
```

</details>

<details>
<summary>
<code>POST</code> <code>/step_functions/addStepFunction</code> Adds a step function to the database.
</summary>

### Parameters

> | name | type     | data type | description                                          |
> | ---- | -------- | --------- | ---------------------------------------------------- |
> | body | required | object    | the arn that corresponds to a specific state machine |

#### Example Body JSON

```json
{ "arn": "arn:partition:service:region:account-id:resource-type:resource-id" }
```

### Responses

> | http code | content-type                     | response |
> | --------- | -------------------------------- | -------- |
> | `200`     | `application/json;charset=UTF-8` | JSON     |
> | `400`     | `application/json;charset=UTF-8` | JSON     |
> | `401`     | `application/json;charset=UTF-8` | JSON     |

### Example Responses

#### 200 Returns the newly added step function

```json
{
  "step_function_id": 0,
  "name": "string",
  "definition": {}
}
```

### Not Yet Implemented

#### 400 Invalid ARN

```json
{ "error": "Invalid arn" }
```

#### 401 Unauthorized

```json
{ "error": "Unauthorized to access this arn" }
```

</details>

### **Average Latencies**

<details>
<summary>
<code>GET</code> <code>/average-latencies/{step_function_id}</code> Gets yesterday's latency data per hour for the step function and each step.
</summary>

### Parameters

> | name             | type     | data type   | description                                  |
> | ---------------- | -------- | ----------- | -------------------------------------------- |
> | step_function_id | required | integer > 0 | unique id associated with this step function |

### Responses

> | http code | content-type                     | response |
> | --------- | -------------------------------- | -------- |
> | `200`     | `application/json;charset=UTF-8` | JSON     |

### Example Responses

#### 200 Sorted by start_time in hour increments

```json
[
  {
    "step_function_average_latency": 12.345,
    "start_time": "isoString",
    "steps": {
      "step_name": {
        "average": 54.4123512
      },
      "other_step_name": {
        "average": 54.4123512
      }
    }
  }
]
```

</details>

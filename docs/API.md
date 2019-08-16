# API endpoints prototype

## Users

### GET /admin/coachmarks/users

List of all CMS users

Sample response:
```json
[
    {
        id: 8,
        username: 'abryrath',
    },
    {
        id: 1,
        username: 'admin',
    },
]
```
---
## Coachmarks

### GET /admin/coachmarks/coachmarks

List of all Coachmark records available to the currently logged in user. A coachmark record is available to a user if he is in the list of 'Readonly Users' or 'Read/Write Users' for the coachmark.

Example query for this might be:
```php
<?php
$coachmarks = Coachmark::find()->relatedTo($userId)->all();
```

Sample Response:
```json
[
    {
        id: 99,
        name: 'Coachmark Name',
        readonlyUsers: [8],
        readWriteUsers: [1],
        steps: [
            {
                id: 1010,
                order: 1,
                label: 'Click the entries button',
                url: '/',
                nodeSelector: '#button',
                tooltipPosition: 'right',
            },
            {
                id: 1011,
                order: 2,
                label: 'Click the new entry button',
                url: '/entries',
                nodeSelector: '#button',
                tooltipPosition: 'bottom',
            }
        ],
    },
    // More coachmarks
]
```

### POST /admin/coachmarks/coachmarks/new

Create a new coachmark

Sample body:
```json
{
    name: 'Name',
    readonlyUsers: [],
    readWriteUsers: [1]
}
```

Sample Response:
```json
{
    result: 'success',
    id: 101 // New coachmark record id
}
```

### POST /admin/coachmarks/coachmarks/edit

Alter an existing coachmark

Sample body:
```json
{
    id: 101, // Coachmark record is
    name: 'Name',
    readonlyUsers: [],
    readWriteUsers: [1]
}
```

Sample response:

```json
{
    result: 'success',
}
```
---
## Steps

### POST /admin/coachmarks/steps/new

Create a new step

Sample body:
```json
{
    coachmarkId: 101,
    order: 1, // If null/empty, then add it to the end of the list of existing steps for this coachmark
    label: 'Label',
    url: '/url',
    nodeSelector: '#node',
    tooltipPosition: 'bottom'
}
```

Sample response:
```json
{
    result: 'success',
    id: 999, // New step record id
}
```

### POST /admin/coachmarks/steps/edit

Alter an exising step

Sample body:
```json
{
    id: // Step record id
    coachmarkId: 101,
    order: 1, // If null/empty, then add it to the end of the list of existing steps for this coachmark
    label: 'Label',
    url: '/url',
    nodeSelector: '#node',
    tooltipPosition: 'bottom'
}
```

Sample response:
```json
{
    result: 'success'
}
```
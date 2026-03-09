# C4 DIAGRAM

## Context Diagram
![Context Diagram](https://github.com/ICT-Mahidol/2025-ITCS383-Arai-Kor-Dai/blob/08df8f1f41f7fdc5928c94abb98a8924b8edd500/designs/Context%20Diagram%20(Current)%20white.svg)






## Container Diagram
### Bank System
![Bank System](https://github.com/ICT-Mahidol/2025-ITCS383-Arai-Kor-Dai/blob/5f2cf5c15291958e1bfe178af797652039a9e7f4/designs/Bank%20system%20App%20Diagram%20(Current)%20white.svg)


### Post Office Management
![Post Office Management](https://github.com/ICT-Mahidol/2025-ITCS383-Arai-Kor-Dai/blob/6e67cad12ec638105288ac24f01bf26d8593a464/designs/Post%20office%20management%20App%20Diagram%20(Current).svg)


## Component Diagram
### Fronend/Backend
![Component Diagram](https://github.com/ICT-Mahidol/2025-ITCS383-Arai-Kor-Dai/blob/ac9f0d1e3d44d98954bb4d7080b0866cfb3b02fe/designs/Fronend_Backend%20App%20Diagram%20(Current).svg)

### Shipping Service
![Component Diagram](https://github.com/ICT-Mahidol/2025-ITCS383-Arai-Kor-Dai/blob/55f5149376e3976acfdc951efd4759ef5d147dde/designs/Shipping%20service%20App%20Diagram%20(Current).svg
)
### Payment Service
![Component Diagram]()

### Logistic Service
![Component Diagram](https://github.com/ICT-Mahidol/2025-ITCS383-Arai-Kor-Dai/blob/55f5149376e3976acfdc951efd4759ef5d147dde/designs/Logistic%20engine%20App%20Diagram%20(Current).svg
)

### Tracking Store Service
![Component Diagram]( https://github.com/ICT-Mahidol/2025-ITCS383-Arai-Kor-Dai/blob/55f5149376e3976acfdc951efd4759ef5d147dde/designs/Tracking%20store%20service%20App%20Diagram%20(Current).svg
)

### Office Service
![Component Diagram](https://github.com/ICT-Mahidol/2025-ITCS383-Arai-Kor-Dai/blob/55f5149376e3976acfdc951efd4759ef5d147dde/designs/Office%20Service%20App%20Diagram%20(Current).svg)


### Use Case Diagram
![Use Case Diagram](Use_Case_Diagram_Arai-Kor-Dai.png)

### Class Diagram
![Class Diagram](Class_Diagram_Arai-Kor-Dai.png)

# DFD Diagram (Level 0)
```mermaid
flowchart LR

Customer[Customer]
Admin[Post Office Staff]
Bank[Bank System]

System((Post Office System))

Customer -->|Register Info / Login Credentials| System
Customer -->|Shipment Details| System
Customer -->|Payment Information| System
Customer -->|Tracking Request| System

System -->|Shipping Label / Tracking Number| Customer
System -->|Parcel Status / Transaction History| Customer

Admin -->|Approve User / Request Statistics| System
System -->|Reports / Revenue Statistics| Admin
Admin -->|View Histrory revanue| System

System -->|Payment Request| Bank
Bank -->|Payment Confirmation| System
```

# DFD Diagram (Level 1)
```mermaid
flowchart TB

Customer[Customer]
Admin[Admin]
Bank[Bank System]

P1((User Management))
P2((Shipment Management))
P3((Payment Processing))
P4((Tracking Management))
P5((Insurance Processing))
P6((Admin Dashboard))

D1[(User Database)]
D2[(Shipment Database)]
D3[(Payment Database)]
D4[(Tracking Database)]

%% User Management
Customer -->|Register Info / Login Credentials| P1
P1 -->|Store User Data| D1
D1 -->|User Data| P1
P1 -->|Login Result| Customer

%% Shipment Management
Customer -->|Shipment Details| P2
P2 -->|Store Shipment| D2
D2 -->|Shipment Data| P2
P2 -->|Shipping Price / Tracking Number| Customer

%% Insurance
Customer -->|Insurance Request| P5
P5 -->|Update Insurance Data| D2

%% Payment
Customer -->|Payment Information| P3
P3 -->|Payment Request| Bank
Bank -->|Payment Confirmation| P3
P3 -->|Save Transaction| D3

%% Tracking
Customer -->|Tracking Number| P4
P4 -->|Read Tracking Data| D4
D4 -->|Parcel Status| P4
P4 -->|Parcel Status| Customer

%% Admin
Admin -->|Approve User Request| P6
P6 -->|Update User Status| D1

Admin -->|View Statistics| P6
P6 -->|Read Shipment Data| D2
P6 -->|Read Payment Data| D3

P6 -->|Reports / Statistics| Admin
```


















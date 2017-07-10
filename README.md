# Nosey Neighbor

## 5 Models

1. User
  * pw hash
  * email
2. Residence
  * address
  * occupants (arr)
  * incidents (arr of incident-ids)
3. Incident
  * userId (User Model)
  * time-stamp
  * type (validation **stretch goal**)
  * description
  * residenceId (Residence Model)
  * comments (arr)
4. Comment
  * userId (User Model)
  * incidentId (Incident Model)
  * content
  * time-stamp
5. Profile
  * userId (User Model)
  * name
  * residenceId (Residence Model)
  * phone
  * bio

## 5 Routes

1. /api/signup
  * POST: email + pw => token
2. /api/residences
  * POST: address => house-id
  * GET: houseId => whole object
  * PUT: houseId + occupants => whole object
3. /api/incidents
  * POST: token + type (validated) + content + houseId => whole object
  * GET: () => array of incidents
  * GET: incidentId => whole object
4. /api/comments
  * POST: token + incidentId + content => whole object
  * PUT: token + content => whole object (user validated)
  * DEL: token + content => 204 (user validated)
5. /api/profiles
  * POST: token + name + residenceId + phone + bio
  * PUT: token + phone &/|| bio

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

## 6 Routes

1. /api/signup
  * POST: email + pw => token, 201

2. /api/signin
  * GET: basicAuth => token, 200

3. /api/residences
  * POST: address => residenceId, 201
  * GET: /residenceId => whole object, 200
  * GET: / => pagination of whole residence objects, 200
  * PUT: residenceId + occupants => 202

4. /api/incidents
  * POST: token + type (validated) + content + residenceId => whole object, 201
  * GET: / => array of incidents, 200
  * GET: incidentId => whole object, 200

5. /api/comments
  * POST: token + incidentId + content => whole object, 201
  * GET: /commentId => whole object, 200
  * GET: / => pagination of whole comment objects, 200
  * PUT: token + content => whole object (user validated), 202
  * DEL: token + content => 204 (user validated)

6. /api/profiles
  * POST: token + name + residenceId + phone + bio => whole object, 201
  * PUT: /profileId + token + phone &/|| bio => 202
  * GET: /profileId => whole object, 200

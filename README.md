# Nosey Neighbor

## 5 Models

1. User
  * user-id (mongo)
  * pw hash
  * email
2. Residence
  * house-id (mongo)
  * address
  * occupants (arr)
  * incidents (arr of incident-ids)
3. Incident
  * incident-id (mongo)
  * creator-id (User Model)
  * time-stamp
  * type (validation)
  * description
  * house-id (Residence Model)
  * comments (arr)
4. Comment
  * comment-id (mongo)
  * time-stamp
  * incident-id (Incident Model)
  * user-id (User Model)
  * content
5. Profile
  * user-id (User Model)
  * name
  * residence-id (Residence Model)
  * phone
  * bio

## 5 Routes

1. /api/signup
  * POST: email + pw => token
2. /api/residences
  * POST: address => house-id
  * GET: house-id => whole object
  * PUT: house-id + occupants => whole object
3. /api/incidents
  * POST: token + type (validated) + content + house-id => whole object
  * GET: () => array of incidents
  * GET: incident-id => whole object
4. /api/comments
  * POST: token + incident-id + content => whole object
  * PUT: token + content => whole object (user validated)
  * DEL: token + content => 204 (user validated)
5. /api/profiles
  * POST: token + name + residence-id + phone + bio
  * PUT: token + phone &/|| bio

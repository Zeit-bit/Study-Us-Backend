/*
POST - Register users
test1: Recibo username, email, password(email no registrado)
expect: user
test2: Recibo username, email, password(email ya registrado)
expect: {error: 'duplicated field in db'}

test3: Me falta username
expect: {error: 'Missing fields'}
test4: Me falta email
expect: {error: 'Missing fields'}
test4: Me falta password
expect: {error: 'Missing fields'}
*/

/*
POST - Login users
test1: Recibo email, password (email registrado)
expect: {token: ..., username: ..., email: ...}
test2: Recibo email, password (email no registrado)
expect: {error: 'invalid username or password'}
test3: Me falta email
expect: {error: 'invalid username or password'}
test4: Me falta password
expect: {error: 'invalid username or password'}
*/

/*
GET - View profile
*/

/*
PUT - Update profile
*/

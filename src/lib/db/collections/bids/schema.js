import fields from './fields.json'
const schema = {
  "title": "bids",
  "version": 0,
  "description": "describes a bid on a single product",
  "primaryKey": "id",
  "required": ['id', 'bid', 'product', 'email'],
  "type": "object",
  properties: fields,
  indexes: [['product', 'email']]
}

export default {schema};
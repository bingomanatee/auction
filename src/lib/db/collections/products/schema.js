import fields from './fields.json'
const schema = {
  "title": "products",
  "version": 0,
  "description": "describes a simple hero",
  "primaryKey": "id",
  "required": ['id', 'name'],
  "type": "object",
  properties: fields
}

export default {schema};
const prefix = 'auto_gen_type_'
let index = 0


export default function createType () {
  return `${prefix}${index++}`
}
class BaseService {
  constructor(model) {
    this.model = model
  }

  create(resource) {
    return this.model.create(resource)
  }

  update(resourceIdentifier, updateParams) {
    return this.show(resourceIdentifier).then(resource => resource.update(updateParams))
  }

  index() {
    return this.model.all()
  }

  show(resourceIdentifier) {
    const field = Object.keys(resourceIdentifier)[0]

    return this.model.findOne({
      where: {[field]: resourceIdentifier[field]}
    })
  }

  destroy(resourceIdentifier) {
    return this.show(resourceIdentifier).then(resource => resource.destroy())
  }
}

export default BaseService
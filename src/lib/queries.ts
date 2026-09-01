export const projectsQuery = `
  *[_type == "project"] | order(order asc, year desc, title asc) {
    "id": _id,
    title,
    category,
    year,
    order,
    description,
    images
  }
`

export const aboutQuery = `
  *[_type == "about"][0] {
    bio,
    email,
    address
  }
`

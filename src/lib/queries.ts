export const projectsQuery = `
  *[_type == "project"] | order(year desc, title asc) {
    "id": _id,
    title,
    category,
    year,
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

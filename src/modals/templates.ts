export const PERSON_TEMPLATE = `
#person #social
      
\`\`\`dataviewjs
try {
  const meta = dv.current().file.frontmatter;

  // Create header
  const firstname = meta.firstname.charAt(0).toUpperCase() + meta.firstname.slice(1);
  const lastname = " " + meta.lastname.charAt(0).toUpperCase() + meta.lastname.slice(1);
  
  dv.header(1, firstname + lastname);
  
  // Create bullet points with meta data
  const exclude = meta.excludeFields;
  const listEntries = Object.entries(meta).filter(([field]) => !exclude.includes(field)).map(([field, value]) => {
    return dv.span("**" + field + ":** " + value);
  });
  
  dv.list(listEntries);
} catch(err) {
  dv.span("<br>");
  dv.span("\*Data missing, could not generate contact...*");
  console.error(err)
}
\`\`\`
# Notes
`;

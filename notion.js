const { Client } = require("@notionhq/client")

const notion = new Client({ auth: process.env.NOTION_API_KEY })

// async function getDatabase() {
//     const response = await notion.databases.retrieve({
//         database_id: process.env.NOTION_DATABASE_ID
//     })
//     console.log(response)
// }

// getDatabase()

function notionPropertiesById(properties) {
  return Object.values(properties).reduce((obj, property) => {
    const { id, ...rest } = property
    return { ...obj, [id]: rest }
  }, {})
}

function createSuggestion({ title, description }) {
  notion.pages.create({
    parent: {
      database_id: process.env.NOTION_DATABASE_ID,
    },
    properties: {
      [process.env.NOTION_TITLE_ID]: {
        title: [
          {
            type: "text",
            text: {
              content: title,
            },
          },
        ],
      },
      [process.env.NOTION_DESCRIPTION_ID]: {
        rich_text: [
          {
            type: "text",
            text: {
              content: description,
            },
          },
        ],
      },
    },
  })
}

createSuggestion({title : "Test", description : "hello"})

async function getSuggestions() {
    const notionPages = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
    })
  
    return notionPages.results.map(fromNotionObject)
  }

function fromNotionObject(notionPage) {
    const propertiesById = notionPropertiesById(notionPage.properties)
  
    return {
      id: notionPage.id,
      title: propertiesById[process.env.NOTION_TITLE_ID].title[0].plain_text,
      description: propertiesById[process.env.NOTION_DESCRIPTION_ID].rich_text[0].text.content,
    }
  }
  

  module.exports = {
    createSuggestion,
    getSuggestions,
  }
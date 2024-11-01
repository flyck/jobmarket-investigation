import type { JobSuggestion, JobSuggestionResponse } from "./types";

const INSTAFFO_JOBS_API_ENDPOINT = "https://app.instaffo.com/candidate/api/v1/job_suggestions"

async function getData() {
  const authCookie = Bun.env.INSTAFFO_COOKIE || "auth missing"
  let responses: JobSuggestion[] = []
  let nextToken
  let firstCall = true

  while (firstCall || nextToken != undefined) {
    const apiArguments: { [key: string]: string | object } = {
      "changedField": "locations",
      "filters": {
        "jobStatus": "open",
        "jobRoles": ["backend-developer", "frontend-developer", "full-stack-developer"],
        "locations": [{
          "city": "Berlin", "country": "Germany"
        }]
      },
    }

    if (nextToken) {
      apiArguments["searchAfter"] = nextToken
    }

    const response = await fetch(INSTAFFO_JOBS_API_ENDPOINT, {
      method: "POST",
      body: JSON.stringify(apiArguments),
      headers: {
        "Content-Type": "application/json",
        "Cookie": authCookie
      },
    });

    try {
      const data = await response.json() as JobSuggestionResponse
      nextToken = data.meta.searchAfter
      responses.push(...data.jobSuggestions)
      console.log(data.jobSuggestions.map((suggestion) => `${suggestion.job.name} at ${suggestion.job.company.name}`))
      console.log(data.meta)
    } catch (error) {
      console.log("Parsing response failed!")
      console.log(response)
    }
    firstCall = false
  }

  console.log("Writing results to file...")
  Bun.write("fetched_data.json", JSON.stringify(responses, null, 2))
  console.log("Done.")
}

// for some reason the api returns duplicate entries at random points during the pagination
async function removeDuplicates() {
  const data: JobSuggestion[] = await Bun.file("fetched_data.json").json()
  const result: JobSuggestion[] = []
  const pushedJobIds: string[] = []
  data.forEach((entry) => {
    if (!pushedJobIds.includes(entry.job.uuid)) {
      result.push(entry)
      pushedJobIds.push(entry.job.uuid)
    } else {
      console.log(`skipped job ${entry.job.name}`)
    }
  })

  Bun.write("deduplicated_data.json", JSON.stringify(result, null, 2))
}

async function analyzeData() {
  const data: JobSuggestion[] = await Bun.file("fetched_data.json").json()
  console.log(`Number of jobs: ${data.length}`)
  console.log(data.map((suggestion) => `${suggestion.job.name} at ${suggestion.job.company.name}`))
}

// await getData()
// await removeDuplicates()
//await analyzeData()

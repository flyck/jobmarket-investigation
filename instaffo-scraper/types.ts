export interface JobSuggestionResponse {
  jobSuggestions: JobSuggestion[]
  meta: Meta
}

export interface JobSuggestion {
  favoritedJob: boolean
  seenJob: boolean
  hiddenJob: boolean
  favoritedCandidate: boolean
  favorite: boolean
  seen: boolean
  hidden: boolean
  matching: Matching
  job: Job
  location: Location2
}

export interface Matching {
  score: number
  componentScores: ComponentScores
}

export interface ComponentScores {
  skills: number
}

export interface Job {
  additionalInfo: any
  jobRoles: JobRoles
  uuid: string
  name: string
  seniorities: string[]
  management: boolean
  degree: string
  freelancer: boolean
  willingnessToTravel: boolean
  contractType: string
  remoteType: string
  hybridType: string
  remote: boolean
  onsite: boolean
  hybrid: boolean
  salaryMin: any
  salaryMax: any
  currency: any
  programmingLanguages: ProgrammingLanguage[]
  frameworks: Framework[]
  salaryMatch: SalaryMatch
  salaryEstimation: SalaryEstimation
  company: Company
  languages: Language[]
  locations: Location[]
  topSkills: TopSkill[]
  responsibles: Responsible[]
  primaryResponsible: PrimaryResponsible
}

export interface JobRoles {
  "software-engineering": string[]
}

export interface ProgrammingLanguage {
  name: string
}

export interface Framework {
  name: string
}

export interface SalaryMatch {
  match: string
  value: number
  currency: string
}

export interface SalaryEstimation {
  match: string
}

export interface Company {
  name: string
  companyType: string
  logo: string
  imageUploads: ImageUpload[]
}

export interface ImageUpload {
  uuid: string
  original: string
  thumbnail: string
}

export interface Language {
  title: string
  rating: string
  mustHave: boolean
}

export interface Location {
  uuid: string
  countryCode: string
  city: string
  country: string
  fullName: string
  name: string
}

export interface TopSkill {
  uuid: string
  name: string
}

export interface Responsible {
  name: string
  gender: string
  jobTitle: string
  department: string
  picture: string
}

export interface PrimaryResponsible {
  name: string
  gender: string
  jobTitle: string
  department: string
  picture: string
}

export interface Location2 {
  uuid: string
  fullName: string
  name: string
}

export interface Meta {
  page: number
  perPage: number
  totalPages: number
  totalResults: number
  searchAfter: string[]
  pitId: string
}

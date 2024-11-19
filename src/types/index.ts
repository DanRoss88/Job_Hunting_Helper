export interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    description: string;
    url: string;
    matchScore?: number;
    applied?: boolean;
  }
  
  export interface Resume {
    id: string;
    content: string;
    skills: string[];
    experience: string[];
    education: string[];
  }
import { ObjectId } from 'mongodb';

export class ExperienceAPI {
    constructor(db) {
        this.db = db;
    }

    // ==================== About Me Methods ====================
    
    async getAboutMe() {
        try {
            const aboutMe = await this.db.collection('aboutMe').findOne();
            return aboutMe;
        } catch (error) {
            console.error('Error fetching about me:', error);
            throw new Error('Failed to fetch about me');
        }
    }

    async createAboutMe(aboutMeData) {
        try {
            // Check if about me already exists
            const existing = await this.db.collection('aboutMe').countDocuments();
            if (existing > 0) {
                throw new Error('About me already exists. Use PUT to update.');
            }
            
            const dataWithTimestamp = {
                ...aboutMeData,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            const result = await this.db.collection('aboutMe').insertOne(dataWithTimestamp);
            return {
                ...dataWithTimestamp,
                _id: result.insertedId
            };
        } catch (error) {
            console.error('Error creating about me:', error);
            throw new Error(error.message || 'Failed to create about me');
        }
    }

    async updateAboutMe(aboutMeData) {
        try {
            const updateFields = {
                ...aboutMeData,
                updatedAt: new Date()
            };
            
            const { _id, ...updateData } = updateFields;
            
            const result = await this.db.collection('aboutMe').findOneAndUpdate(
                {},
                { $set: updateData },
                { returnDocument: 'after', upsert: true }
            );
            
            return result;
        } catch (error) {
            console.error('Error updating about me:', error);
            throw new Error('Failed to update about me');
        }
    }

    async deleteAboutMe() {
        try {
            const result = await this.db.collection('aboutMe').deleteOne({});
            
            if (result.deletedCount === 0) {
                throw new Error('About me not found');
            }
            
            return { success: true, message: 'About me deleted successfully' };
        } catch (error) {
            console.error('Error deleting about me:', error);
            throw new Error(error.message || 'Failed to delete about me');
        }
    }

    // ==================== Contacts Methods ====================
    
    async getAllContacts() {
        try {
            const contacts = await this.db.collection('contacts').find().sort({ _id: -1 }).toArray();
            return contacts;
        } catch (error) {
            console.error('Error fetching contacts:', error);
            throw new Error('Failed to fetch contacts');
        }
    }

    async getContactById(id) {
        try {
            let contact;
            
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                contact = await this.db.collection('contacts').findOne({ _id: new ObjectId(id) });
            } else {
                contact = await this.db.collection('contacts').findOne({ id: id });
            }
            
            if (!contact) {
                throw new Error('Contact not found');
            }
            
            return contact;
        } catch (error) {
            console.error('Error fetching contact by id:', error);
            throw new Error(error.message || 'Failed to fetch contact');
        }
    }

    async createContact(contactData) {
        try {
            const dataWithTimestamp = {
                ...contactData,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            const result = await this.db.collection('contacts').insertOne(dataWithTimestamp);
            return {
                ...dataWithTimestamp,
                _id: result.insertedId
            };
        } catch (error) {
            console.error('Error creating contact:', error);
            throw new Error('Failed to create contact');
        }
    }

    async updateContact(id, contactData) {
        try {
            let query;
            
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                query = { _id: new ObjectId(id) };
            } else {
                query = { id: id };
            }
            
            const { _id, ...updateData } = contactData;
            const dataWithTimestamp = {
                ...updateData,
                updatedAt: new Date()
            };
            
            const result = await this.db.collection('contacts').findOneAndUpdate(
                query,
                { $set: dataWithTimestamp },
                { returnDocument: 'after' }
            );
            
            if (!result) {
                throw new Error('Contact not found');
            }
            
            return result;
        } catch (error) {
            console.error('Error updating contact:', error);
            throw new Error(error.message || 'Failed to update contact');
        }
    }

    async deleteContact(id) {
        try {
            let query;
            
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                query = { _id: new ObjectId(id) };
            } else {
                query = { id: id };
            }
            
            const result = await this.db.collection('contacts').deleteOne(query);
            
            if (result.deletedCount === 0) {
                throw new Error('Contact not found');
            }
            
            return { success: true, message: 'Contact deleted successfully' };
        } catch (error) {
            console.error('Error deleting contact:', error);
            throw new Error(error.message || 'Failed to delete contact');
        }
    }

    // ==================== Experiences Methods ====================
    
    async getAllExperiences() {
        try {
            const experiences = await this.db.collection('experiences').find().sort({ startDate: -1 }).toArray();
            return experiences;
        } catch (error) {
            console.error('Error fetching experiences:', error);
            throw new Error('Failed to fetch experiences');
        }
    }

    async getExperienceById(id) {
        try {
            let experience;
            
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                experience = await this.db.collection('experiences').findOne({ _id: new ObjectId(id) });
            } else {
                experience = await this.db.collection('experiences').findOne({ id: id });
            }
            
            if (!experience) {
                throw new Error('Experience not found');
            }
            
            return experience;
        } catch (error) {
            console.error('Error fetching experience by id:', error);
            throw new Error(error.message || 'Failed to fetch experience');
        }
    }

    async createExperience(experienceData) {
        try {
            const dataWithTimestamp = {
                ...experienceData,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            const result = await this.db.collection('experiences').insertOne(dataWithTimestamp);
            return {
                ...dataWithTimestamp,
                _id: result.insertedId
            };
        } catch (error) {
            console.error('Error creating experience:', error);
            throw new Error('Failed to create experience');
        }
    }

    async updateExperience(id, experienceData) {
        try {
            let query;
            
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                query = { _id: new ObjectId(id) };
            } else {
                query = { id: id };
            }
            
            const { _id, ...updateData } = experienceData;
            const dataWithTimestamp = {
                ...updateData,
                updatedAt: new Date()
            };
            
            const result = await this.db.collection('experiences').findOneAndUpdate(
                query,
                { $set: dataWithTimestamp },
                { returnDocument: 'after' }
            );
            
            if (!result) {
                throw new Error('Experience not found');
            }
            
            return result;
        } catch (error) {
            console.error('Error updating experience:', error);
            throw new Error(error.message || 'Failed to update experience');
        }
    }

    async deleteExperience(id) {
        try {
            let query;
            
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                query = { _id: new ObjectId(id) };
            } else {
                query = { id: id };
            }
            
            const result = await this.db.collection('experiences').deleteOne(query);
            
            if (result.deletedCount === 0) {
                throw new Error('Experience not found');
            }
            
            return { success: true, message: 'Experience deleted successfully' };
        } catch (error) {
            console.error('Error deleting experience:', error);
            throw new Error(error.message || 'Failed to delete experience');
        }
    }

    // ==================== Skills Methods ====================
    
    async getAllSkills() {
        try {
            const skills = await this.db.collection('skills').find().sort({ category: 1, name: 1 }).toArray();
            return skills;
        } catch (error) {
            console.error('Error fetching skills:', error);
            throw new Error('Failed to fetch skills');
        }
    }

    async getSkillById(id) {
        try {
            let skill;
            
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                skill = await this.db.collection('skills').findOne({ _id: new ObjectId(id) });
            } else {
                skill = await this.db.collection('skills').findOne({ id: id });
            }
            
            if (!skill) {
                throw new Error('Skill not found');
            }
            
            return skill;
        } catch (error) {
            console.error('Error fetching skill by id:', error);
            throw new Error(error.message || 'Failed to fetch skill');
        }
    }

    async createSkill(skillData) {
        try {
            const dataWithTimestamp = {
                ...skillData,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            const result = await this.db.collection('skills').insertOne(dataWithTimestamp);
            return {
                ...dataWithTimestamp,
                _id: result.insertedId
            };
        } catch (error) {
            console.error('Error creating skill:', error);
            throw new Error('Failed to create skill');
        }
    }

    async updateSkill(id, skillData) {
        try {
            let query;
            
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                query = { _id: new ObjectId(id) };
            } else {
                query = { id: id };
            }
            
            const { _id, ...updateData } = skillData;
            const dataWithTimestamp = {
                ...updateData,
                updatedAt: new Date()
            };
            
            const result = await this.db.collection('skills').findOneAndUpdate(
                query,
                { $set: dataWithTimestamp },
                { returnDocument: 'after' }
            );
            
            if (!result) {
                throw new Error('Skill not found');
            }
            
            return result;
        } catch (error) {
            console.error('Error updating skill:', error);
            throw new Error(error.message || 'Failed to update skill');
        }
    }

    async deleteSkill(id) {
        try {
            let query;
            
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                query = { _id: new ObjectId(id) };
            } else {
                query = { id: id };
            }
            
            const result = await this.db.collection('skills').deleteOne(query);
            
            if (result.deletedCount === 0) {
                throw new Error('Skill not found');
            }
            
            return { success: true, message: 'Skill deleted successfully' };
        } catch (error) {
            console.error('Error deleting skill:', error);
            throw new Error(error.message || 'Failed to delete skill');
        }
    }

    // Initialize collections with default data if empty
    async initializeExperienceData() {
        try {
            // Initialize aboutMe
            const aboutMeCount = await this.db.collection('aboutMe').countDocuments();
            if (aboutMeCount === 0) {
                const defaultAboutMe = {
                    title: "About Me",
                    content: "I'm a Frontend Developer with 4+ years of professional experience, specializing in React, TypeScript, Next.js and Vue.js ecosystems. I've successfully delivered scalable applications across Manufacturing, Distribution, IT Outsourcing, FinTech, E-commerce, and Media industries, serving thousands of daily users with high-performance solutions.",
                    image: "/me.jpeg",
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                await this.db.collection('aboutMe').insertOne(defaultAboutMe);
                console.log('Default about me created');
            }

            // Initialize contacts
            const contactsCount = await this.db.collection('contacts').countDocuments();
            if (contactsCount === 0) {
                const defaultContacts = [
                    {
                        id: "1",
                        type: "email",
                        label: "Email",
                        value: "azizjon.nigmatjonov2@gmail.com",
                        url: "mailto:azizjon.nigmatjonov2@gmail.com",
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        id: "2",
                        type: "website",
                        label: "Website",
                        value: "azizjon7.uz",
                        url: "https://azizjon7.uz/",
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        id: "3",
                        type: "linkedin",
                        label: "LinkedIn",
                        value: "linkedin.com/in/azizjon-nigmatjonov",
                        url: "https://www.linkedin.com/in/azizjon-nigmatjonov/",
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                ];
                await this.db.collection('contacts').insertMany(defaultContacts);
                console.log('Default contacts created');
            }

            // Initialize experiences
            const experiencesCount = await this.db.collection('experiences').countDocuments();
            if (experiencesCount === 0) {
                const defaultExperiences = [
                    {
                        id: "1",
                        company: "MARK FORMELLE",
                        position: "Middle Frontend Developer",
                        location: "Manufacturing & Retail (Fashion / FMCG)",
                        startDate: "2024-08",
                        endDate: null,
                        description: "Developing Android applications and React-based platforms for production automation and real-time monitoring.",
                        technologies: ["React", "React Native", "Expo", "TypeScript", "Jest", "Cypress"],
                        achievements: [
                            "Developed Android application for automating production processes and real-time statistics, adapted for TSD Scanner equipment integration",
                            "Built React Native and Expo-based Android application, implementing Expo Air for real-time update handling and seamless data synchronization",
                            "Building analogous platform for Turkey's clothing production platform \"Egamen\", providing end-to-end process control from order intake to product delivery to clients",
                            "Architected React ecosystem-based platform with AI-integrated statistics, worker salary management, and real-time monitoring of knitting machine status",
                            "Ensured uninterrupted and stable platform operation for +2000 users, developing comprehensive testing strategy using Jest and Cypress libraries with Unit testing (80%), Component testing (15%), and E2E testing (5%)",
                            "Set up CI/CD pipeline, achieved 90% code coverage and 100% test coverage"
                        ],
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        id: "2",
                        company: "NAJOT TA'LIM",
                        position: "Frontend Mentor",
                        location: "Education / EdTech",
                        startDate: "2024-07",
                        endDate: "2025-02",
                        description: "Teaching frontend development fundamentals and mentoring students to become employed developers.",
                        technologies: ["JavaScript", "React", "HTML", "CSS"],
                        achievements: [
                            "Collaborating with the team to achieve 80% of students transitioning from zero programming experience to employed developers",
                            "Taught JavaScript core, Algorithms, React fundamentals, HTML, and CSS to +15 students, providing comprehensive foundation for frontend development"
                        ],
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        id: "3",
                        company: "ABIZ",
                        position: "Frontend Team Lead",
                        location: "Distribution / FMCG",
                        startDate: "2023-09",
                        endDate: "2024-08",
                        description: "Leading frontend team and developing CRM systems for warehouse management and sales operations.",
                        technologies: ["React", "TypeScript", "Cypress"],
                        achievements: [
                            "Developed CRM system for warehouse management, sales, and monthly accounting in React and TypeScript ecosystem, streamlining business operations and data management",
                            "Led a 4-person frontend team using Scrum",
                            "Implemented E2E testing using Cypress testing library, ensuring comprehensive test coverage and application reliability",
                            "Managed code quality control and efficient code writing through Git workflow, establishing best practices and maintaining high standards across the team",
                            "Experienced in Git workflow and establishing CI/CD pipelines and testing"
                        ],
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        id: "4",
                        company: "UDEVS",
                        position: "Frontend Developer",
                        location: "IT Outsourcing",
                        startDate: "2022-03",
                        endDate: "2023-08",
                        description: "Developing scalable web applications and project management platforms serving thousands of daily users.",
                        technologies: ["React", "TypeScript", "JavaScript", "GraphQL", "Apollo Client", "Jest"],
                        achievements: [
                            "Developed UPM platform similar to Jira and Cucumber for UDEVS, implementing complex drag-and-drop functionality, testing phases, and analytics (Nivo) charts for comprehensive project management",
                            "Developed scalable web applications serving +10,000 daily users with proficiency in React, TypeScript, and JavaScript",
                            "Established comprehensive testing strategy using Jest",
                            "Integrated GraphQL into web applications using Apollo Client",
                            "Optimized frontend performance through code splitting, lazy loading, memoization DRY, and SOLID principles"
                        ],
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        id: "5",
                        company: "MOUNTAIN",
                        position: "Frontend Developer",
                        location: "IT Outsourcing",
                        startDate: "2021-02",
                        endDate: "2022-03",
                        description: "Developing Vue.js-based single-page applications with optimized performance and enhanced user experience.",
                        technologies: ["Vue.js", "JavaScript", "GSAP", "Figma"],
                        achievements: [
                            "Developed Vue based single-page applications (SPA) with optimized performance and enhanced user experience",
                            "Collaborated closely with UX/UI designers using Figma to create intuitive, user-friendly interfaces aligned with business goals",
                            "Implemented smooth website animations using GSAP",
                            "Experienced in efficient code writing and team collaboration using Git workflow, and Jira board management"
                        ],
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                ];
                await this.db.collection('experiences').insertMany(defaultExperiences);
                console.log('Default experiences created');
            }

            // Initialize skills
            const skillsCount = await this.db.collection('skills').countDocuments();
            if (skillsCount === 0) {
                const defaultSkills = [
                    // Core Technologies
                    { id: "1", name: "JavaScript (ES6+)", category: "Core Technologies", proficiency: 95, icon: "🟨", createdAt: new Date(), updatedAt: new Date() },
                    { id: "2", name: "React", category: "Core Technologies", proficiency: 95, icon: "⚛️", createdAt: new Date(), updatedAt: new Date() },
                    { id: "3", name: "TypeScript", category: "Core Technologies", proficiency: 90, icon: "📘", createdAt: new Date(), updatedAt: new Date() },
                    { id: "4", name: "Next.js", category: "Core Technologies", proficiency: 90, icon: "▲", createdAt: new Date(), updatedAt: new Date() },
                    { id: "5", name: "React Native", category: "Core Technologies", proficiency: 85, icon: "📱", createdAt: new Date(), updatedAt: new Date() },
                    { id: "6", name: "Vue.js 3", category: "Core Technologies", proficiency: 80, icon: "💚", createdAt: new Date(), updatedAt: new Date() },
                    { id: "7", name: "HTML", category: "Core Technologies", proficiency: 95, icon: "🌐", createdAt: new Date(), updatedAt: new Date() },
                    { id: "8", name: "CSS", category: "Core Technologies", proficiency: 90, icon: "🎨", createdAt: new Date(), updatedAt: new Date() },
                    { id: "9", name: "SCSS", category: "Core Technologies", proficiency: 88, icon: "💅", createdAt: new Date(), updatedAt: new Date() },
                    { id: "10", name: "React Router", category: "Core Technologies", proficiency: 90, icon: "🔄", createdAt: new Date(), updatedAt: new Date() },
                    { id: "11", name: "React Navigation", category: "Core Technologies", proficiency: 85, icon: "🧭", createdAt: new Date(), updatedAt: new Date() },
                    { id: "12", name: "Expo", category: "Core Technologies", proficiency: 85, icon: "📦", createdAt: new Date(), updatedAt: new Date() },
                    
                    // Performance & Architecture
                    { id: "13", name: "Rendering Performance Optimization", category: "Performance & Architecture", proficiency: 90, icon: "⚡", createdAt: new Date(), updatedAt: new Date() },
                    { id: "14", name: "Caching Strategies", category: "Performance & Architecture", proficiency: 85, icon: "💾", createdAt: new Date(), updatedAt: new Date() },
                    { id: "15", name: "Responsive Design", category: "Performance & Architecture", proficiency: 95, icon: "📱", createdAt: new Date(), updatedAt: new Date() },
                    { id: "16", name: "Code Splitting", category: "Performance & Architecture", proficiency: 90, icon: "✂️", createdAt: new Date(), updatedAt: new Date() },
                    { id: "17", name: "Lazy Loading", category: "Performance & Architecture", proficiency: 90, icon: "🔄", createdAt: new Date(), updatedAt: new Date() },
                    { id: "18", name: "React Window", category: "Performance & Architecture", proficiency: 85, icon: "🪟", createdAt: new Date(), updatedAt: new Date() },
                    { id: "19", name: "React Dev tools", category: "Performance & Architecture", proficiency: 90, icon: "🔧", createdAt: new Date(), updatedAt: new Date() },
                    
                    // Testing & Quality
                    { id: "20", name: "Jest", category: "Testing & Quality", proficiency: 90, icon: "🧪", createdAt: new Date(), updatedAt: new Date() },
                    { id: "21", name: "React Testing Library", category: "Testing & Quality", proficiency: 90, icon: "🧪", createdAt: new Date(), updatedAt: new Date() },
                    { id: "22", name: "Cypress", category: "Testing & Quality", proficiency: 85, icon: "🌲", createdAt: new Date(), updatedAt: new Date() },
                    { id: "23", name: "E2E Testing", category: "Testing & Quality", proficiency: 85, icon: "✅", createdAt: new Date(), updatedAt: new Date() },
                    { id: "24", name: "Unit Testing", category: "Testing & Quality", proficiency: 90, icon: "🔬", createdAt: new Date(), updatedAt: new Date() },
                    { id: "25", name: "Component Testing", category: "Testing & Quality", proficiency: 88, icon: "🧩", createdAt: new Date(), updatedAt: new Date() },
                    { id: "26", name: "Code Quality Best Practices", category: "Testing & Quality", proficiency: 90, icon: "⭐", createdAt: new Date(), updatedAt: new Date() },
                    { id: "27", name: "CI/CD Integration", category: "Testing & Quality", proficiency: 85, icon: "🔄", createdAt: new Date(), updatedAt: new Date() },
                    
                    // Development Tools
                    { id: "28", name: "Webpack", category: "Development Tools", proficiency: 85, icon: "📦", createdAt: new Date(), updatedAt: new Date() },
                    { id: "29", name: "Vite", category: "Development Tools", proficiency: 90, icon: "⚡", createdAt: new Date(), updatedAt: new Date() },
                    { id: "30", name: "Git", category: "Development Tools", proficiency: 95, icon: "📦", createdAt: new Date(), updatedAt: new Date() },
                    { id: "31", name: "Git Flow", category: "Development Tools", proficiency: 90, icon: "🌊", createdAt: new Date(), updatedAt: new Date() },
                    { id: "32", name: "GitHub Actions", category: "Development Tools", proficiency: 85, icon: "⚙️", createdAt: new Date(), updatedAt: new Date() },
                    
                    // APIs & State Management
                    { id: "33", name: "REST APIs", category: "APIs & State Management", proficiency: 90, icon: "🔌", createdAt: new Date(), updatedAt: new Date() },
                    { id: "34", name: "GraphQL", category: "APIs & State Management", proficiency: 85, icon: "🔷", createdAt: new Date(), updatedAt: new Date() },
                    { id: "35", name: "Redux", category: "APIs & State Management", proficiency: 85, icon: "🔄", createdAt: new Date(), updatedAt: new Date() },
                    { id: "36", name: "Redux Toolkit", category: "APIs & State Management", proficiency: 85, icon: "🛠️", createdAt: new Date(), updatedAt: new Date() },
                    { id: "37", name: "Zustand", category: "APIs & State Management", proficiency: 80, icon: "🐻", createdAt: new Date(), updatedAt: new Date() },
                    { id: "38", name: "React Query", category: "APIs & State Management", proficiency: 85, icon: "🔄", createdAt: new Date(), updatedAt: new Date() },
                    { id: "39", name: "Vuex", category: "APIs & State Management", proficiency: 75, icon: "📦", createdAt: new Date(), updatedAt: new Date() },
                    { id: "40", name: "Pinia", category: "APIs & State Management", proficiency: 75, icon: "🍍", createdAt: new Date(), updatedAt: new Date() },
                    { id: "41", name: "React Context", category: "APIs & State Management", proficiency: 90, icon: "🔗", createdAt: new Date(), updatedAt: new Date() },
                    
                    // UI Libraries & Design
                    { id: "42", name: "Material UI (MUI)", category: "UI Libraries & Design", proficiency: 90, icon: "🎨", createdAt: new Date(), updatedAt: new Date() },
                    { id: "43", name: "Chakra UI", category: "UI Libraries & Design", proficiency: 85, icon: "🌈", createdAt: new Date(), updatedAt: new Date() },
                    { id: "44", name: "Tailwind CSS", category: "UI Libraries & Design", proficiency: 90, icon: "💨", createdAt: new Date(), updatedAt: new Date() },
                    { id: "45", name: "Styled Components", category: "UI Libraries & Design", proficiency: 88, icon: "💅", createdAt: new Date(), updatedAt: new Date() },
                    { id: "46", name: "Sass/SCSS", category: "UI Libraries & Design", proficiency: 88, icon: "💅", createdAt: new Date(), updatedAt: new Date() },
                    { id: "47", name: "User-Centric Design Principles", category: "UI Libraries & Design", proficiency: 85, icon: "✨", createdAt: new Date(), updatedAt: new Date() },
                    { id: "48", name: "Responsive", category: "UI Libraries & Design", proficiency: 95, icon: "📱", createdAt: new Date(), updatedAt: new Date() },
                    
                    // Leadership & Collaboration
                    { id: "49", name: "Team Mentoring & Guidance", category: "Leadership & Collaboration", proficiency: 90, icon: "👥", createdAt: new Date(), updatedAt: new Date() },
                    { id: "50", name: "Architectural Decision Making", category: "Leadership & Collaboration", proficiency: 88, icon: "🏗️", createdAt: new Date(), updatedAt: new Date() },
                    { id: "51", name: "Cross-Functional Collaboration", category: "Leadership & Collaboration", proficiency: 90, icon: "🤝", createdAt: new Date(), updatedAt: new Date() },
                    { id: "52", name: "Resource Planning & Allocation", category: "Leadership & Collaboration", proficiency: 85, icon: "📊", createdAt: new Date(), updatedAt: new Date() },
                    { id: "53", name: "Code Review & Best Practices", category: "Leadership & Collaboration", proficiency: 90, icon: "👀", createdAt: new Date(), updatedAt: new Date() },
                    
                    // Additional Skills
                    { id: "54", name: "Node.js", category: "Additional Skills", proficiency: 75, icon: "🟢", createdAt: new Date(), updatedAt: new Date() },
                    { id: "55", name: "MongoDB", category: "Additional Skills", proficiency: 70, icon: "🍃", createdAt: new Date(), updatedAt: new Date() },
                    { id: "56", name: "WebSocket", category: "Additional Skills", proficiency: 80, icon: "🔌", createdAt: new Date(), updatedAt: new Date() },
                    { id: "57", name: "Security Best Practices", category: "Additional Skills", proficiency: 85, icon: "🔒", createdAt: new Date(), updatedAt: new Date() },
                ];
                await this.db.collection('skills').insertMany(defaultSkills);
                console.log('Default skills created');
            }
        } catch (error) {
            console.error('Error initializing experience data:', error);
            throw error;
        }
    }
}

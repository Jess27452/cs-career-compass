insert into public.career_paths(slug,name,short_description,category,math_intensity,algorithm_importance,sort_order) values
('software-engineering','Software Engineering','Design and maintain dependable software products.','Systems','low','high',1),
('frontend-engineering','Frontend Engineering','Create fast, accessible interfaces.','Web','low','medium',2),
('backend-engineering','Backend Engineering','Build APIs, services, and data systems.','Web','low','high',3),
('full-stack-engineering','Full-Stack Engineering','Own product experiences from interface to database.','Web','low','medium',4),
('mobile-development','Mobile Development','Build native and cross-platform mobile experiences.','Mobile','low','medium',5),
('machine-learning-ai','Machine Learning & AI','Develop systems that learn from data.','AI','high','medium',6),
('data-science','Data Science','Turn data into evidence and decisions.','Data','high','low',7),
('data-engineering','Data Engineering','Create reliable pipelines and data platforms.','Data','medium','medium',8),
('cybersecurity','Cybersecurity','Find weaknesses and protect systems.','Security','medium','low',9),
('cloud-devops','Cloud & DevOps','Automate delivery and operate resilient infrastructure.','Systems','low','low',10),
('game-development','Game Development','Create interactive systems and worlds.','Games','high','medium',11),
('quantitative-development','Quantitative Development','Engineer research and trading systems.','Finance','high','high',12),
('technical-product-management','Technical Product Management','Translate user needs into technical direction.','Product','low','low',13),
('research-graduate-school','Research & Graduate School','Create new knowledge through rigorous inquiry.','Research','high','medium',14);

insert into public.roadmap_phases(career_path_id,title,description,sort_order)
select c.id,p.title,p.description,p.sort_order from public.career_paths c cross join (values
('Foundations','Choose one language, learn Git, and practice debugging.',1),
('Core technical skills','Learn the concepts and patterns used in the role.',2),
('Tools and workflows','Use testing, review, and delivery habits.',3),
('First project','Ship a focused solution to a real problem.',4),
('Advanced project','Add reliability, scale, or rigorous evaluation.',5),
('Portfolio and resume','Explain decisions, evidence, and impact.',6),
('Interview preparation','Practice role-specific technical and behavioral skills.',7),
('Applications and networking','Build a broad, organized pipeline.',8)
) as p(title,description,sort_order);

insert into public.roadmap_steps(roadmap_phase_id,title,description,why_it_matters,difficulty,estimated_effort,required,sort_order)
select p.id,p.title,'Complete a focused milestone for '||c.name||': '||p.description,
'This milestone turns general advice into evidence you can explain.','beginner','2–6 weeks',true,1
from public.roadmap_phases p join public.career_paths c on c.id=p.career_path_id;

insert into public.projects(slug,title,short_description,difficulty,estimated_duration,project_type,technologies,sort_order)
select slug,title,description,difficulty,'3–8 weeks',kind,string_to_array(tech,', '),n from (values
(1,'collaborative-coding-room','Collaborative coding interview room','Real-time editor, test runner, presence, and feedback.','advanced','WebSockets, Docker','web'),
(2,'campus-opportunity-aggregator','Campus opportunity aggregator','Normalize and search local research, club, and job opportunities.','intermediate','Next.js, PostgreSQL','web'),
(3,'distributed-url-shortener','Distributed URL shortener','A fault-aware redirect service with caching and observability.','advanced','Go, Redis','systems'),
(4,'personal-finance-analytics','Personal finance analytics','Explain spending patterns with privacy-minded import.','intermediate','TypeScript, SQL','data'),
(5,'paper-recommender','Research-paper recommender','Recommend related papers with transparent similarity signals.','advanced','Python, PyTorch','ai'),
(6,'accessible-course-planner','Accessible course planner','Plan prerequisites with keyboard-first interaction.','intermediate','React, Graphs','web'),
(7,'study-room-availability','Study-room availability app','Show live occupancy estimates and room details.','intermediate','React Native, Supabase','mobile'),
(8,'ml-experiment-tracker','ML experiment tracker','Compare runs, metrics, parameters, and artifacts.','advanced','Python, FastAPI','ai'),
(9,'student-project-scanner','Student project scanner','Detect exposed secrets and risky dependencies.','advanced','Python, Semgrep','security'),
(10,'cloud-deployment-monitor','Cloud deployment monitor','Track health, deploys, logs, and service indicators.','advanced','Go, OpenTelemetry','cloud'),
(11,'multiplayer-browser-game','Multiplayer browser game','Authoritative game state with lag compensation.','advanced','Canvas, WebSockets','game'),
(12,'public-data-pipeline','Public-data pipeline','Ingest, validate, transform, and publish civic data.','intermediate','Airflow, dbt','data'),
(13,'medication-reminder','Medication reminder prototype','Accessible offline-first reminders.','intermediate','Swift, SQLite','mobile'),
(14,'resume-version-tracker','Resume version tracker','Connect resume revisions to application outcomes.','intermediate','Next.js, Postgres','web'),
(15,'api-reliability-lab','API reliability lab','Visualize retries, queues, and circuit breakers.','advanced','Go, Kafka','systems'),
(16,'privacy-settings-auditor','Privacy settings auditor','Explain browser permission and tracker behavior.','intermediate','TypeScript, Browser APIs','security'),
(17,'feature-flag-service','Feature flag service','Targeted rollouts, audit history, and safe defaults.','advanced','Kotlin, Redis','systems'),
(18,'data-quality-observatory','Data quality observatory','Surface freshness, drift, and ownership.','advanced','Python, dbt','data'),
(19,'local-first-notes','Local-first notes sync','Resolve concurrent offline edits.','advanced','TypeScript, CRDTs','web'),
(20,'accessibility-grader','Portfolio accessibility grader','Turn audit findings into learning cards.','intermediate','Playwright, axe-core','web'),
(21,'quant-research-notebook','Quant research notebook','Backtest a factor with leakage controls.','advanced','Python, statsmodels','finance'),
(22,'experiment-design-assistant','Experiment design assistant','Create metrics, sample-size plans, and guardrails.','intermediate','Python, SQL','data'),
(23,'open-source-contributor-map','Open-source contributor map','Match newcomers to well-scoped issues.','intermediate','GraphQL, Next.js','product'),
(24,'paper-replication-kit','Paper replication kit','Package reproducible code and evaluation notes.','advanced','Python, Docker','research')
) as x(n,slug,title,description,difficulty,tech,kind);

insert into public.resource_categories(slug,name,sort_order)
select regexp_replace(lower(name),'[^a-z0-9]+','-','g'),name,n from (values
(1,'Programming Foundations'),(2,'Data Structures and Algorithms'),(3,'Web Development'),(4,'Mobile Development'),
(5,'Machine Learning'),(6,'Data Science'),(7,'Data Engineering'),(8,'Cybersecurity'),(9,'Cloud and DevOps'),
(10,'System Design'),(11,'Databases and SQL'),(12,'Git and GitHub'),(13,'Resume Writing'),(14,'Behavioral Interviews'),
(15,'Internship Search'),(16,'Open Source'),(17,'Research'),(18,'Portfolio Development')
) x(n,name);

insert into public.resources(slug,title,url,normalized_url,short_description,resource_format,is_community_submitted,is_verified,is_featured)
select slug,title,url,url,description,format,false,true,featured from (values
('mdn','MDN Web Docs','https://developer.mozilla.org/','Durable web-platform documentation.','Documentation',true),
('cs50x','CS50x','https://cs50.harvard.edu/x/','Harvard introduction to computer science.','Course',true),
('mit-algorithms','MIT OpenCourseWare: Algorithms','https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/','University algorithms course materials.','Course',true),
('python-docs','Python Documentation','https://docs.python.org/3/','Official Python language documentation.','Documentation',false),
('typescript-handbook','TypeScript Handbook','https://www.typescriptlang.org/docs/handbook/intro.html','Official TypeScript learning guide.','Documentation',false),
('react-docs','React Documentation','https://react.dev/learn','Official React learning materials.','Documentation',false),
('next-docs','Next.js Documentation','https://nextjs.org/docs','Official Next.js documentation.','Documentation',false),
('postgres-tutorial','PostgreSQL Tutorial','https://www.postgresql.org/docs/current/tutorial.html','Official PostgreSQL tutorial.','Documentation',false),
('sqlbolt','SQLBolt','https://sqlbolt.com/','Interactive SQL practice.','Practice platform',false),
('git-book','Git Book','https://git-scm.com/book/en/v2','Official open Git reference.','Book',false),
('github-skills','GitHub Skills','https://skills.github.com/','Interactive GitHub exercises.','Practice platform',false),
('missing-semester','The Missing Semester','https://missing.csail.mit.edu/','Practical developer tools from MIT.','Course',true),
('full-stack-open','Full Stack Open','https://fullstackopen.com/en/','Modern web development course.','Course',false),
('web-dev-learn','web.dev Learn','https://web.dev/learn/','Browser-focused web curricula.','Course',false),
('owasp-top-ten','OWASP Top 10','https://owasp.org/www-project-top-ten/','Major web application security risks.','Documentation',false),
('portswigger-academy','Web Security Academy','https://portswigger.net/web-security','Hands-on web security learning.','Practice platform',true),
('docker-start','Docker Get Started','https://docs.docker.com/get-started/','Official container learning path.','Tutorial',false),
('kubernetes-basics','Kubernetes Basics','https://kubernetes.io/docs/tutorials/kubernetes-basics/','Official Kubernetes tutorial.','Tutorial',false),
('aws-skill-builder','AWS Skill Builder','https://skillbuilder.aws/','Cloud learning from AWS.','Course',false),
('pytorch-tutorials','PyTorch Tutorials','https://pytorch.org/tutorials/','Official ML framework tutorials.','Tutorial',false),
('sklearn-guide','scikit-learn User Guide','https://scikit-learn.org/stable/user_guide.html','Official machine learning guide.','Documentation',false),
('kaggle-learn','Kaggle Learn','https://www.kaggle.com/learn','Short practical data courses.','Course',false),
('pandas-guide','pandas User Guide','https://pandas.pydata.org/docs/user_guide/','Official pandas guide.','Documentation',false),
('dbt-fundamentals','dbt Fundamentals','https://learn.getdbt.com/','Analytics engineering foundations.','Course',false),
('airflow-docs','Apache Airflow Docs','https://airflow.apache.org/docs/','Official workflow orchestration docs.','Documentation',false),
('system-design-primer','System Design Primer','https://github.com/donnemartin/system-design-primer','Open system design reference.','Repository',true),
('interview-handbook','Tech Interview Handbook','https://www.techinterviewhandbook.org/','Technical interview preparation guide.','Guide',false),
('interview-warmup','Google Interview Warmup','https://grow.google/certificates/interview-warmup/','Behavioral interview practice.','Practice platform',false),
('student-pack','GitHub Student Developer Pack','https://education.github.com/pack','Developer tools for eligible students.','Tool',false),
('open-source-guides','Open Source Guides','https://opensource.guide/','Guidance for contributors and maintainers.','Guide',false)
) x(slug,title,url,description,format,featured);

insert into public.checklist_items(category,title,sort_order) values
('Foundations','Choose a primary programming language',1),('Foundations','Learn Git and GitHub',2),('Foundations','Understand basic data structures',3),('Foundations','Learn debugging',4),('Portfolio','Complete one small project',5),('Portfolio','Complete one substantial project',6),('Portfolio','Write a strong README',7),('Portfolio','Deploy at least one project',8),('Professional Materials','Draft and review resume',9),('Professional Materials','Prepare project explanations',10),('Interview Preparation','Learn major coding patterns',11),('Interview Preparation','Prepare behavioral stories',12),('Applications','Build a company list',13),('Applications','Track applications and follow up',14);

insert into public.forum_categories(slug,name,sort_order) values
('general','General Career Questions',1),('internships','Internship Applications',2),('interviews','Interview Experiences',3),
('resume','Resume and Portfolio',4),('projects','Project Ideas',5),('technical','LeetCode and Technical Interviews',6),
('ml-data','Machine Learning and Data Science',7),('web-mobile','Web and Mobile Development',8),('security','Cybersecurity',9),
('research','Research Opportunities',10),('resources','Resource Recommendations',11),('teammates','Find Teammates',12),('feedback','Platform Feedback',13);

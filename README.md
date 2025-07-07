### **BETA TEST PLAN – TEMPLATE**

## **1. Core Functionalities for Beta Version**
[List and describe the core functionalities th  at must be available for beta testing. Explain any changes made since the original Tech3 Action Plan.]

| **Feature Name**                                       | **Description**                                                                                                                                                                                                                                                                                         | **Priority (High/Medium/Low)** | **Changes Since Tech3**                  |
|--------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------|------------------------------------------|
| User Registration and Profile Creation	                | Users can sign up, create, and customize their profile with personal details and an avatar                                                                                                                                                                                                              | High                           | Added : ability to link profiles to teams |
| Team Creation, Joining and Managing                    | Users can create teams, manage, invite members, and join existing teams                                                                                                                                                                                                                                 | High                           | [No Modification or addition]            |
| Tournament Creation, Joining and Managing (IN THE APP) | Users can create tournaments, join them, and track progress                                                                                                                                                                                                                                             | Low                            | [No Modification or addition]            |
| Matchmaking & Ranking System                           | Matchmaking based on players’ skill levels, with ranking displays                                                                                                                                                                                                                                       | High                           | Added : Rank for team (to define)        |
| Messaging System                                       | Messaging between users for private and team-based discussions                                                                                                                                                                                                                                          | Low                            | [No Modification or addition]            |
| Discord & Bot Discord                                  | We chose Discord as our main communication platform because it allows real-time interaction, teamwork, and community engagement. To enhance this experience, the Hive Discord bot was created to organize and manage tournaments easily, making competitions more accessible and structured for everyone. | High                           | The Hive Discord bot is designed to create and manage tournaments seamlessly within the community. It supports up to 32 teams, allows bracket customization, and lets users personalize titles, backgrounds, and colors. The bot automates match tracking and rankings, making tournament organization more efficient and engaging for everyone.                            |
| Bracket Visualization                                  | Visual representation of tournament brackets and match progression                           | Medium                         |New feature for improved UX
| Game API Integration                                   | Allow users to link accounts from games (e.g., Valorant, LoL) to fetch stats | High                           |New feature: adaptation of game APIs|
---

## **2. Beta Testing Scenarios**
### **2.1 User Roles**
[Define the different user roles that will be involved in testing, e.g., Admin, Regular User, Guest, External Partner.]

| **Role Name**           | **Description** |
|-------------------------|---------------|
| Admin                   | Manages users, teams, and tournaments. Can approve registrations and modify settings |
| Regular User            | Regular user who can create profiles, teams, join tournaments, and send messages |
| Team/Tournament Creator | A regular user who has the privilege to create and manage their own teams or tournaments, including inviting members and making changes to the settings of their created teams or tournaments |
| Guest                   | Unregistered user with limited access (viewing profiles, tournaments) |

### **2.2 Test Scenarios**
For each core functionality, provide detailed test scenarios.

#### **Scenario 1: [User Registration and Profile Creation]**
- **Role Involved:** [Regular User]
- **Objective:** [Test user registration and profile creation]
- **Preconditions:** [The user doesn't have an account on the platform]
- **Test Steps:**
  1. User clicks on "Sign Up"
  2. Fill in required fields (name, email, password)
  3. Add an avatar and complete the profile information
- **Expected Outcome:** Profile is successfully created, the user receives a confirmation email, and is redirected to the homepage

#### **Scenario 2: [Team Creation and Joining]**
- **Role Involved:** [Regular User]
- **Objective:** [Test team creation and member integration]
- **Preconditions:** [The user is logged in with another user also logged in]
- **Test Steps:**
  1. Click on "Create a Team" and enter the team information (name, description)
  2. Invite another user to join the team via a link
  3. Verify that the invited member successfully joins the team
- **Expected Outcome:** The team is successfully created, and the invited member joins without issues
- 
#### **Scenario 3: [Tournament Creation and Joining]**
- **Role Involved:** [Admin, Regular User]
- **Objective:** [Test tournament creation and participant registration]
- **Preconditions:** [User is logged in as either an admin or regular user]
- **Test Steps:**
  1. Click on "Create Tournament"
  2. Fill in the required information (date, format, required teams, etc...)
  3. Users can register for the tournament
- **Expected Outcome:** The tournament is created successfully, and head of a team can register. Admin of tournament approves registrations

#### **Scenario 4: [Fake Tournament Simulation]**
- **Role Involved:** [Admin]
- **Objective:** [Simulate match result entry and check if rank updates]
- **Preconditions:** [Two teams are already registered in a created tournament]
- **Test Steps:**
  1. Team A plays against Team B, Team A wins
  2. Admin inputs the result into the system
  3. Bracket updates and Team A progresses 
  4. Team A receives rank boost based on predefined rules

- **Expected Outcome:** Bracket and ranks are updated accordingly. System stores historical data.

#### **Scenario 5: [Global Ranking and History Overview]**
- **Role Involved:** [Regular User]
- **Objective:** [View ranking, stats, and history]
- **Preconditions:** [The user has participated in tournaments/matches]
- **Test Steps:**
  1. Navigate to "Rankings" or "My Stats"
  2. View current rank and match/tournament history 
  3. Check progression over time

- **Expected Outcome:**  Ranking and full performance history are clearly visible

#### **Scenario 6: [Linking Game Account and Fetching Stats]**
- **Role Involved:** [Regular User]
- **Objective:** [Test API link to external game data]
- **Preconditions:** [The user owns a compatible game account]
- **Test Steps:** 
  1. Click "Link Game Account"
  2. Select game (e.g., LoL) and authenticate 
  3. Confirm stat fetch and display

- **Expected Outcome:** Game stats successfully retrieved and integrated into the user's Hive profile

---

## **3. Success Criteria**
[Define the metrics and conditions that determine if the beta version is successful.]

Success criteria for the beta test:

- **User Engagement:** At least 50% of registered users actively participate in team or tournament creation.
- **No Critical Bugs:** No major bugs affecting core functionalities (registration, team creation, tournament participation).
- **Performance:** Page load times for core features should not exceed 2 seconds (With optimal internet).
- **User Feedback:** Users should find the interface intuitive and easy to use
- **Game API Integration:** Stats are retrieved and displayed successfully in 90% of test cases


---

## **4. Known Issues & Limitations**
[List any known bugs, incomplete features, or limitations that testers should be aware of.]

| **Issue**    | **Description**                                                       | **Impact**                 | **Planned Fix? (Yes/No)** |
|--------------|-----------------------------------------------------------------------|----------------------------|---------------------------|
| Limitation 1 | [No support for tournaments with more than 32 teams in discord]       | Low                        | No                        |
| Limitation 2 | [API for requesting stats of player limited (depends of the request)] | Low now, higher and higher | We would like             |
| Bug 1        | Bracket not updating properly – In some cases, the tournament bracket does not refresh automatically after a match result is entered.                                                                | High                         | Already Fixed                        |
| Bug 2        | Team registration glitches – Some users experienced difficulties when joining or creating teams due to inconsistent role assignments.         | High   | Yes (In Progress)
| Bug 3        | Final team registration bug – When adding the last team to a tournament, the team is correctly saved in the JSON file, but the tournament image fails to generate.         | High   | Already Fixed



## **5. Conclusion**

The purpose of this Beta Test Plan is to validate the core features of Hive before its public launch. The team expects detailed feedback regarding the user interface, system performance, and integration of key features. Testers will be encouraged to report bugs and suggest improvements for a better user experience. The success of this phase will allow us to fix any remaining issues before the official release.

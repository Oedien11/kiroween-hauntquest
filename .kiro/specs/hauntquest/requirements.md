# Requirements — HauntQuest (Kiroween 2026, Costume Contest)

## Introduction
HauntQuest is a single-page web app that tracks daily free crypto quests
(airdrops, mints, check-ins, claims, bounties) with deadlines, streaks and
XP, stored locally in the browser. No accounts, no backend, no wallet.

## Glossary
- **Quest**: one trackable opportunity (title, project, chain, type, reward,
  XP, deadline, link, notes, recurring flag, status).
- **Streak**: consecutive days with at least one completed quest.
- **Rank**: XP title, stepping up every 500 XP.
- **Seed quests**: the 8 built-in quests shipped with the app.

## Requirements

### Requirement 1: Quest management
**User Story:** As a hunter, I want to add, edit and delete quests, so my
list always matches what I am actually chasing.

#### Acceptance Criteria
1. WHEN the user submits the quest form with a title THEN THE SYSTEM SHALL
   create a quest with status `todo` and persist it to localStorage.
2. WHEN the user submits the form with an empty title THEN THE SYSTEM SHALL
   refuse to save and show a validation message.
3. WHEN the user submits a URL that does not start with `http://` or
   `https://` THEN THE SYSTEM SHALL refuse to save and show a validation
   message.
4. WHEN the user edits a quest THEN THE SYSTEM SHALL keep its id, status
   and completion history.
5. WHEN the user deletes a quest THEN THE SYSTEM SHALL remove it after a
   confirmation prompt.

### Requirement 2: Status workflow
**User Story:** As a hunter, I want to move quests through todo → doing →
done (or skipped), so I can see what is left today.

#### Acceptance Criteria
1. WHEN the user completes a quest THEN THE SYSTEM SHALL set status `done`,
   record the completion time, and award its XP.
2. WHEN the user reopens a done quest THEN THE SYSTEM SHALL set status
   `todo` and clear the completion time.
3. WHEN a daily recurring quest was completed on a previous day THEN THE
   SYSTEM SHALL return it to `todo` on next load.

### Requirement 3: Finding quests
**User Story:** As a hunter with many quests, I want to filter and sort the
list, so the urgent ones surface first.

#### Acceptance Criteria
1. WHEN the user types in search THEN THE SYSTEM SHALL match title, project,
   reward and notes case-insensitively.
2. WHEN the user picks a status, chain or type filter THEN THE SYSTEM SHALL
   show only matching quests.
3. WHEN sorting by deadline THEN THE SYSTEM SHALL order nearest deadline
   first and dateless quests last.
4. WHEN no quest matches THEN THE SYSTEM SHALL show an empty-state message.

### Requirement 4: Deadlines
**User Story:** As a hunter, I want to see what expires next, so I never
miss a claim window.

#### Acceptance Criteria
1. WHEN a quest has a future deadline THEN THE SYSTEM SHALL show a
   human-readable countdown (e.g. `2d 5h left`, `45m left`).
2. WHEN a quest's deadline has passed and it is not done or skipped THEN
   THE SYSTEM SHALL mark it visually overdue.
3. WHEN at least one open quest has a deadline THEN THE SYSTEM SHALL show
   the nearest one in the page header.

### Requirement 5: Progress, streaks and ranks
**User Story:** As a hunter, I want streaks and XP, so daily grinding feels
worth doing.

#### Acceptance Criteria
1. WHEN quests are completed THEN THE SYSTEM SHALL show total XP, done/total
   count, today's completions, and overall completion percentage.
2. WHEN completions exist on consecutive days THEN THE SYSTEM SHALL count
   them as a streak; a missed day SHALL reset the streak to 0.
3. WHEN total XP crosses a multiple of 500 THEN THE SYSTEM SHALL promote
   the hunter to the next rank (Lost Soul → Wandering Ghost → Pumpkin
   Keeper → Crypt Master → Haunt Legend).

### Requirement 6: Portability
**User Story:** As a hunter, I want to back up and restore my quests, so a
new device does not lose my list.

#### Acceptance Criteria
1. WHEN the user clicks Export THEN THE SYSTEM SHALL download the quest list
   as JSON.
2. WHEN the user imports a JSON file that is not an array of valid quests
   THEN THE SYSTEM SHALL refuse it and show an error.
3. WHEN the user clicks Reset THEN THE SYSTEM SHALL restore the 8 seed
   quests after a confirmation prompt.

### Requirement 7: Offline, private, free
**User Story:** As a hunter, I want the app to work with no account and no
server, so it costs nothing and tracks nothing.

#### Acceptance Criteria
1. WHEN the app loads THEN THE SYSTEM SHALL work from static hosting with
   no network requests beyond its own files.
2. WHEN the app runs THEN THE SYSTEM SHALL store data only in the browser's
   localStorage and never transmit it.

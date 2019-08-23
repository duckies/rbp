# Updating and Tracking Blizzard API Characters

The primary use case of the website is to advertize our community and facilitate an application process for joining us. For members in our community, they can communicate with applicants and view statistics about community member's characters and utilize the site as an ecosystem for maintaining our community.

Blizzard utilizes an OAuth2 API that poses many challenges when trying to make a project revolving around it.

- There is no refresh token, meaning that after an approximate 30 day period or changes are made to the users Battle.net account, the token will expire and cannot be renewed without the user passing through the OAuth flow one more. This means the application has a limited window of when it is able to ask Blizzard which characters the user owns. There is no other useful API for this token as the others are public.
- Characters do not have unique identifiers. The only unique thing about a character is that the Region-Realm-Name association is unique.
- Characters have ranks within the community, rank determines level of access synonymous to a role on a website. If the website gives users roles based off of their in-game rank, if that character is deleted or renamed, someone could maliciously take that same name and commit identity theft.
- Characters can be reported missing for a variety of reasons and includes many false negatives. Characters that are missing can often be simply old and not logged into for a while, flagged for name change, a victim of one of the seemingly many outages, or is actually non-existent.
- There are no API resources that describe characters who have left the community. There is only looking up the entire community list of members, or individual characters across the entire game. Someone who immediately leaves our community (either through character deletion, transfer to a new realm, or simply leaving the community), they will still have access to site resources via their previously determined rank until some updating process checks that their name is still present within the community. Various people will also join our website and select a main character on their current realm that, if their application is approved, will change realms and be reported missing. We need a robust system that doesn't allow for exploitation while also avoiding deleting characters that aren't actually deleted, only reported as so incorrectly by Blizzard.

# Refresh Token

Not having a refresh token is actually one of the easier problems to deal with. When the token expires the user will still be able to stay logged in to our site thanks to a JWT token, but the interface will warn them if they are trying to update their characters that their token is expired and provide a one-click button to re-authenticate. Forcefully logging the user out when their token expires is unnecessary and potentially aggravating.

# Character Identity

When a character is being updated we can check for immutable character traits and statistics which cannot be lower than what they once were to find collisions. Character class is immutable, the level of character cannot be lower than it previously was, honorable kills cannot be lower. Achievement points typically cannot become lower, however when expansions change they often remove the point value for achievements no longer possible to obtain. I know certain services dealing with player data take a few specific achievements and record the dates these achievements were earned. If the character does not have these achievements earned, or the dates mismatch, the character is not the same. Simply delete the character when this kind of collision occurs.

# Character Ranks

The "Guild" API provides the list of all characters in the community as well as their rank within the community. We can use an enumerable to associate in-game rank with website roles in a one-to-one relationship. When a community member joins the website we will perform an association update: if any of the characters they own are inside of the guild, we can perform a rank update.

Rank updates will require more careful logic. A character will have likely many characters, each with different ranks. We need to map the user with the character holding the highest authority rank, even if they don't pick that as their main on the website (they may not update it). We are forced to check every character they have in the guild and find the highest rank on each update cycle. If the user has not re-authenticated in a while, they may have a rank too low as we're missing their new high-ranked character, but it will never be too high as we check each character within the community that they own and downgrade their rank if it doesn't match.

# Missing Characters

Perhaps the most logic-inducing problem is that the API can lie to us and say that a character doesn't exist for a myriad of reasons.

## Guild Roster

An update process needs to run in the background that downloads the community roster from the Blizzard API and all of the community members in the database. If a community member is not reported from Blizzard as being in the community, we immediately remove the association with our community and run a role update for this user.

## Character Permanence

Those who are not in our guild but are members of our website are allowed to have a singular main character. It is not computationally expensive to store and update individual characters when there will not be a substantial amount of them using our website when they're within the application process. When an authenticated user is on the website, a rudimentary login process is achieved by sending a JWT token and asking for the user information in response.

A column of the user table contains the last login date for the user. If the user has not been logged in for over a month, their characters will no longer be updated. These characters have a longer update window as there is no major reason to keep updating them outside of their avatars.

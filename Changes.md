# Changes & Challenges

### Problems arise when allowing clients to choose a "Dream Hit"
Some of the recent changes we were figuring out in our HIPO and DFD diagrams for **progress report 3** was the ability for clients to be able to choose the hitman for the job or if they should not be able to choose at all. 
We added an option for the client to look through an outputted list of hitmen that match their specifications for the target they want gone. These hitmen will be outputed as a list from all the eligable hitman 
who are qualified depending on their skills they inputed, and the clients preferred hit methods. This match can result in many hitmen who qualify for the job and thus cause us a problem when deciding for our users.

**Solution One:** We give clients no choice in hitmen and choose the best option for them, allowing no choice </br>
**Solution Two:** We give clients the choice to pick from a list of eligable hitmen who can accept or decline the offer (if they have second thoughts)</br>
**Solution Three:** We let the hitman accept or decline, and the client can rematch using a "REMATCH" button based on if they don't like the hitman chosen for their dream hit</br>

**Solution We Chose:** We chose solution 1 and decided to give our user the best choice chosen by us. 
which will lead the client and hitmen to either successfully match and both parties will then exchange information (under our security). Or if the hitman declines the offer the client will be shown the list of eligable 
hitmen again without the declined offer this time. 

**Changes**
From this problem we realized that we do not have to change our ER diagram or relational model since our client and hitman are still in a 1:1 relationship. At the end of choosing a hitman for their dream hit the client 
will still have only 1 hitman for 1 dream hit (target).

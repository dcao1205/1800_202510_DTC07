import random
import time
from itertools import product
from quiz_bank import quiz_bank

def make_board(rows: int, columns: int) -> dict[tuple[int, int], str]:
    """
    Return a game board with random board assignments.

    :param rows: a positive integer representing the number of rows
    :param columns: another positive integer representing the number of columns
    :precondition: rows and columns must be greater than zero
    :postcondition: create a dictionary where keys are coordinate tuple (row, column) and values are randomly assigned
                    room names
    :return: a dictionary where keys are coordinate tuple (row, column) and values are randomly assigned room names
    """
    coordination = []
    assign_room = ["Empty Room", "Event Room"]
    random_room = random.choices(assign_room, [80, 20], k=int(rows * columns))
    board = {}
    coordination = list(product(range(rows), range(columns)))

    for number in range(len(coordination)):
        board[coordination[number]] = random_room[number]

    return board


def make_character()-> dict[str, int | str]:
    """
    Create a character with initial stats and prompt for a name.

    :postcondition: generate a dictionary with keys: "Name", "X-coordinate", "Y-coordinate", "Level", "Marks", "Sanity",
                    "Max Sanity", "Date Rejects"
    :return:a dictionary with keys: "Name", "X-coordinate", "Y-coordinate", "Level", "Marks", "Sanity", "Max Sanity",
            "Date Rejects"
    """
    user_name = input("System: Please enter your name")

    return {
        'Name': user_name,
        'X-coordinate': 0,
        'Y-coordinate': 0,
        'Level': 1,
        'Marks': 0,
        'Sanity': 10,
        'Max Sanity': 10,
        'Date Rejects': 0
    }

def check_level_up(character):
    """
    Check and level up the character if Marks meets the threshold.

    :param character: a dictionary with keys: "Name", "X-coordinate", "Y-coordinate", "Level", "Marks", "Sanity",
                      "Max Sanity", "Date Rejects"
    :precondition: character must have a key call "level", and value should be an integer
    :precondition: character must have a key call "Marks", and value should be an integer
    :precondition: character must have a key call "Sanity", and value should be an integer
    :precondition: character must have a key call "Max Sanity", and value should be an integer
    :postcondition: updates the character's level, sanity, and max sanity if marks meet threshold
    >>> test_character= {'Level': 1, 'Marks': 50, 'Sanity': 5, 'Max Sanity': 10}
    >>> check_level_up(test_character)
    Every time you look back at the path you've taken, you feel uplifted.
    You think you can continue what you're doing right now.
    You are stronger. Mama didn't give birth to a quitter.
    SYSTEM: You are now LEVEL 2.

    >>> test_character = {'Level': 2, 'Marks': 100, 'Sanity': 9, 'Max Sanity': 12}
    >>> check_level_up(test_character)
    Every time you look back at the path you've taken, you feel uplifted.
    You think you can continue what you're doing right now.
    You are stronger. Mama didn't give birth to a quitter.
    SYSTEM: You are now LEVEL 3.
    """
    thresholds = {1: 45, 2: 90}
    current_level = character["Level"]
    if current_level in thresholds and character["Marks"] >= thresholds[current_level]:
        character["Level"] += 1
        character["Max Sanity"] += 2
        character["Sanity"] = min(character["Sanity"] + 2, character["Max Sanity"])
        print(f"Every time you look back at the path you've taken, you feel uplifted.\n"
              f"You think you can continue what you're doing right now.\n"
              f"You are stronger. Mama didn't give birth to a quitter.\n"

              f"SYSTEM: You are now LEVEL {character['Level']}.")


def describe_current_location(board, character):
    """
    Describe the player's current position (*) and all Event Rooms (E) on the board.

    :param board: a dictionary where keys are coordinate tuple (row, column) and values are randomly assigned room names
    :param character: a dictionary with keys: "Name", "X-coordinate", "Y-coordinate", "Level", "Marks", "Sanity",
                      "Max Sanity", "Date Rejects"
    :precondition: board must be a dictionary where keys are coordinate tuple (row, column) and values are randomly
                    assigned room names
    :precondition: character must be a dictionary with keys: "Name", "X-coordinate", "Y-coordinate", "Level", "Marks",
                   "Sanity", "Max Sanity", "Date Rejects"
    :postcondition: print a formatted string with the character’s position marked as "*" and Event Rooms marked as "E"

    >>> game_board = {(0, 0): 'Empty Room', (0, 1): 'Empty Room', (0, 2): 'Empty Room', (0, 3): 'Event Room',
    ... (0, 4): 'Empty Room', (1, 0): 'Event Room', (1, 1): 'Empty Room', (1, 2): 'Empty Room', (1, 3): 'Empty Room',
    ... (1, 4): 'Empty Room', (2, 0): 'Empty Room', (2, 1): 'Empty Room', (2, 2): 'Empty Room', (2, 3): 'Empty Room',
    ... (2, 4): 'Empty Room',(3, 0): 'Empty Room', (3, 1): 'Empty Room', (3, 2): 'Empty Room', (3, 3): 'Empty Room',
    ... (3, 4): 'Empty Room', (4, 0): 'Empty Room', (4, 1): 'Event Room', (4, 2): 'Empty Room', (4, 3): 'Empty Room',
    ... (4, 4): 'Empty Room'}
    >>> user = {'X-coordinate': 0, 'Y-coordinate': 0, 'Sanity': 5}
    >>> describe_current_location(game_board, user)
    |--+--+--+--+--+--|
    |  *        E     |
    |  E              |
    |                 |
    |                 |
    |     E           |
    |--+--+--+--+--+--|

    >>> game_board = {(0, 0): 'Empty Room', (0, 1): 'Empty Room', (0, 2): 'Empty Room', (0, 3): 'Event Room',
    ... (0, 4): 'Empty Room', (1, 0): 'Event Room', (1, 1): 'Empty Room', (1, 2): 'Empty Room', (1, 3): 'Empty Room',
    ... (1, 4): 'Empty Room', (2, 0): 'Empty Room', (2, 1): 'Empty Room', (2, 2): 'Empty Room', (2, 3): 'Empty Room',
    ... (2, 4): 'Empty Room',(3, 0): 'Empty Room', (3, 1): 'Empty Room', (3, 2): 'Empty Room', (3, 3): 'Empty Room',
    ... (3, 4): 'Empty Room', (4, 0): 'Empty Room', (4, 1): 'Event Room', (4, 2): 'Empty Room', (4, 3): 'Empty Room',
    ... (4, 4): 'Empty Room'}
    >>> user = {'X-coordinate': 4, 'Y-coordinate': 4, 'Sanity': 5}
    >>> describe_current_location(game_board, user)
    |--+--+--+--+--+--|
    |           E     |
    |  E              |
    |                 |
    |                 |
    |     E        *  |
    |--+--+--+--+--+--|
    """
    first_row = "|--+--+--+--+--+--|"
    last_row = "|--+--+--+--+--+--|"
    game_map = [first_row]

    for row in range(5):
        row_str = list("|                 |")
        for col in range(5):
            position = (row, col)
            if position == (character["Y-coordinate"], character["X-coordinate"]):
                row_str[col * 3 + 3] = "*"
            elif board[position] == "Event Room":
                row_str[col * 3 + 3] = "E"
        game_map.append("".join(row_str))

    game_map.append(last_row)
    print("\n".join(game_map))

def count_event_rooms(board):
    """
    Count how many Event Rooms exist on the board.

    :param board: a dictionary where keys are coordinate tuple (row, column) and values are randomly assigned room
                  names
    :precondition: board must be a dictionary where keys are coordinate tuple (row, column) and values are randomly
                   assigned room names
    :postcondition: calculates the number of rooms labeled "Event Room"
    :return: the number of Event Rooms as an integer

    >>> game_board = {(0, 0): 'Empty Room', (0, 1): 'Empty Room', (0, 2): 'Empty Room', (0, 3): 'Event Room',
    ... (0, 4): 'Empty Room', (1, 0): 'Event Room', (1, 1): 'Empty Room', (1, 2): 'Empty Room', (1, 3): 'Empty Room',
    ... (1, 4): 'Empty Room', (2, 0): 'Empty Room', (2, 1): 'Empty Room', (2, 2): 'Empty Room', (2, 3): 'Empty Room',
    ... (2, 4): 'Empty Room',(3, 0): 'Empty Room', (3, 1): 'Empty Room', (3, 2): 'Empty Room', (3, 3): 'Empty Room',
    ... (3, 4): 'Empty Room', (4, 0): 'Empty Room', (4, 1): 'Event Room', (4, 2): 'Empty Room', (4, 3): 'Empty Room',
    ... (4, 4): 'Empty Room'}
    >>> count_event_rooms(game_board)
    3
    >>> game_board = {(0, 0): "Empty Room", (0, 1): "Empty Room"}
    >>> count_event_rooms(game_board)
    0
    """
    room_count = sum(1 for room in board.values() if room == "Event Room")

    return room_count


def get_user_choice(character: dict[str, int | str]) -> dict[str, int]:
    """
    Return the user's chosen direction of movement.

    :param character: a dictionary with keys: "Name", "X-coordinate", "Y-coordinate", "Level", "Marks", "Sanity",
                      "Max Sanity", "Date Rejects"
    :precondition: character must be a dictionary with keys: "Name", "X-coordinate", "Y-coordinate", "Level", "Marks",
                   "Sanity", "Max Sanity", "Date Rejects"
    :postcondition: prints status if player chooses 'S'; returns a direction dict if player chooses 1–4
    :return: a dictionary with key "X-coordinate", "Y-coordinate" and value from 0-1 inclusive representing direction
    """
    while True:
        user_input = input("Please select a direction you wish to go:\n1: North 2: South 3:East 4: West\n"
                           "If you want to check on your status, enter 'S':\n"
                           "> ")
        if user_input == "1":
            return {"X-coordinate": 0, "Y-coordinate": -1}
        elif user_input == '2':
            return {"X-coordinate": 0, "Y-coordinate": 1}
        elif user_input == '3':
            return {"X-coordinate": 1, "Y-coordinate": 0}
        elif user_input == '4':
            return {"X-coordinate": -1, "Y-coordinate": 0}
        elif user_input == 's' or 'S':
            print(f"""
+--+--+--+--+--+--+
 Name     : {character['Name']:<18}
 Level    : {character['Level']:<18}
 Marks    : {character['Marks']:<18}
 Sanity   : {character['Sanity']}/{character['Max Sanity']:<13}
+--+--+--+--+--+--+ """)
            continue
        else:
            continue

def move_character(character, direction):
    """
    Update the character's coordinates based on movement direction.

    :param character: a dictionary with keys: "Name", "X-coordinate", "Y-coordinate", "Level", "Marks", "Sanity",
                      "Max Sanity", "Date Rejects"
    :param direction: a dictionary with movement values {"X-coordinate": int, "Y-coordinate": int}
    :precondition: character must be a dictionary with keys: "Name", "X-coordinate", "Y-coordinate", "Level", "Marks",
                   "Sanity", "Max Sanity", "Date Rejects"
    :precondition: direction must be a dictionary with values {"X-coordinate": int, "Y-coordinate": int}
    :postcondition: character dictionary is updated

    >>> user = {'X-coordinate': 2, 'Y-coordinate': 1, 'Sanity': 5}
    >>> desired_direction = {"X-coordinate": 1, "Y-coordinate": 0}
    >>> move_character(user, desired_direction)
    >>> user
    {'X-coordinate': 3, 'Y-coordinate': 1, 'Sanity': 5}

    >>> user = {'X-coordinate': 2, 'Y-coordinate': 1, 'Sanity': 5}
    >>> desired_direction = {"X-coordinate": 0, "Y-coordinate": 1}
    >>> move_character(user, desired_direction)
    >>> user
    {'X-coordinate': 2, 'Y-coordinate': 2, 'Sanity': 5}
    """

    character["X-coordinate"] += direction["X-coordinate"]
    character["Y-coordinate"] += direction["Y-coordinate"]

def is_alive(character: dict[str, int]) -> bool:
    """
    Determine if the character is still alive based on Sanity.

    :param character: a dictionary with keys: "Name", "X-coordinate", "Y-coordinate", "Level", "Marks", "Sanity",
                      "Max Sanity", "Date Rejects"
    :precondition: character must include a "Sanity" key with a non-negative integer value
    :postcondition: return True if character's HP is greater than 0, False otherwise
    :return: True if character's HP is greater than 0, False otherwise

    >>> user = {'X-coordinate': 4, 'Y-coordinate': 4, 'Sanity': 5}
    >>> is_alive(user)
    True
    >>> user = {'X-coordinate': 4, 'Y-coordinate': 4, 'Sanity': 0}
    >>> is_alive(user)
    False
    """
    if character["Sanity"] == 0:
        return False
    else:
        return True


def wants_to_date(character):
    #I change this room
    """
    Ask user which event to do. Return 'date' or 'work'.If user have already rejected 3 dates, they can no longer date.

    :param character: a dictionary with keys: "Name", "X-coordinate", "Y-coordinate", "Level", "Marks", "Sanity",
                      "Max Sanity", "Date Rejects"
    :precondition: character must include a "Date Rejects" key with a non-negative integer value
    :postcondition: returns True for date, False for work or max rejects
    :return: True if user selects to go on a date, False otherwise
    """
    while True:
        if character["Date Rejects"] >= 3:
            print("SYSTEM: You check your phone, but you suddenly realized he will never ask again\n"
                  "")
            return False

        choice = input("SYSTEM: Want to go for a date? Or work?\n"
                       "1. go for a date\n"
                       "2. work\n")

        if choice == "1":
            return True
        elif choice == "2":
            return False
        else:
            print("Invalid choice.")


def go_on_date(character):
    """
    Increases Sanity and decreases Marks randomly.

    :param character: a dictionary with keys: "Name", "X-coordinate", "Y-coordinate", "Level", "Marks", "Sanity",
                      "Max Sanity", "Date Rejects"
    :precondition: character must include a "Sanity" key with a non-negative integer value
    :precondition: character must include a "Max Sanity" key with a non-negative integer value
    :precondition: character must include a "Marks" key with a non-negative integer value
    :postcondition: Sanity increases from 1 to 2 inclusive up to Max, Marks decrease from 0 to 3 inclusive
    """
    sanity_gain = random.randint(1, 2)
    mark_loss = random.randint(0, 3)

    character["Sanity"] = min(character["Sanity"] + sanity_gain, character["Max Sanity"])
    character["Marks"] = max(0, character["Marks"] - mark_loss)
    print(f"You felt something. +{sanity_gain} Sanity, -{mark_loss} Marks.")


def go_back_to_work(character):
    """
    Increases Marks and Date Rejects.

    :param character: a dictionary with keys: "Name", "X-coordinate", "Y-coordinate", "Level", "Marks", "Sanity",
                      "Max Sanity", "Date Rejects"
    :precondition: character must include a "Date Rejects" key with a non-negative integer value
    :precondition: character must include a "Marks" key with a non-negative integer value
    :postcondition: Sanity increases from 0 to 4 inclusive, Date Rejects increase 1
    """
    mark_gain = random.randint(0, 4)
    character["Marks"] += mark_gain
    character["Date Rejects"] += 1

    print(f"You buried yourself in tasks. +{mark_gain} Marks.")
    if character["Date Rejects"] == 3:
        print("You’ve turned down too many chances. No one asks anymore.")


def ask_quiz_question(character):
    """
    Ask a Chinese radical quiz question. User must answer within 10 seconds.

    :param character: a dictionary with keys: "Name", "X-coordinate", "Y-coordinate", "Level", "Marks", "Sanity",
                      "Max Sanity", "Date Rejects"
    :precondition: character must include a "Sanity" key with a non-negative integer value
    :precondition: character must include a "Level" key with a non-negative integer value
    :precondition: character must include a "Marks" key with a non-negative integer value
    :postcondition: updates character's Sanity or Marks based on answer correctness and timing

    """
    selected = random.choice(quiz_bank)

    print(f"SYSTEM: Radical 部首 is [{selected['radical']}] — {selected['radical_meaning']}")
    print("You have 10 seconds!")
    if character["Level"] > 1:
        display_text = encrypt_question_text(selected["question"], character["Sanity"], character["Level"])
        print("SYSTEM: The question is... corrupted. (10s)")
    else:
        display_text = selected["question"]
        print("SYSTEM: A question whispers to you... (10s)")

    print(display_text)
    for option in selected["options"]:
        print(option)

    start = time.time()
    answer = input("> ").strip()
    elapsed = time.time() - start

    if elapsed > 10:
        print("Too slow. The answer dissolved. -1 Sanity")
        character["Sanity"] -= 1
    elif answer == str(selected["answer_index"]):
        print("Correct! You recognized the radical. +5 Marks")
        character["Marks"] += 5
    else:
        print("Wrong... again. -1 Sanity")
        character["Sanity"] -= 1

    check_level_up(character)

def encrypt_question_text(text: str, sanity: int, level: int) -> str:
    """
    Corrupt the quiz question text based on player sanity and level.

    :param text: the original question text
    :param sanity: the player's current sanity level from 0 to 10 inclusive
    :param level: the player's current level from 1 to 2 inclusive
    :precondition: text must be a non-empty string
    :precondition: sanity must be a non-empty string
    :precondition: level must be a non-empty string
    :postcondition: returns a version of the text with possible corruptions
    :return: a corrupted string simulating visual distortion
    """
    corruption_map = {'a': 'α', 'e': 'ɇ', 'i': '1', 'o': '0', 's': '$', 't': 'ŧ', 'g': '9', 'l': '|', 'c': '<',
                      'h': 'ħ', 'm': 'ʍ', 'n': 'и', 'y': 'γ'}
    corruption_chance = 0.1 + (level * 0.1) + (max(0, 10 - sanity) * 0.05)

    encrypted = ""
    for letter in text:
        if letter.lower() in corruption_map and random.random() < corruption_chance:
            encrypted += corruption_map[letter.lower()]
        elif random.random() < corruption_chance * 0.1:
            encrypted += (letter + "~")
        else:
            encrypted += letter
    return encrypted


def final_question(character):
    """

    :param character:
    :return:
    """
    print("SYSTEM: One last memory... answer carefully.")
    print("What do you want the most?\n")

    start = time.time()
    answer = input("> ").strip().lower()
    elapsed = time.time() - start

    correct = False
    if elapsed <= 15 and ("peace" in answer or "rest" in answer or "freedom" in answer):
        correct = True
    else:
        print("SYSTEM: That wasn't the truth.")
        character["Marks"] -= 3
        character["Sanity"] -= 1

    return correct

def validate_move(board: dict[tuple[int, int], str],
                  character: dict[str, int | str],
                  direction: dict[str, int]) -> bool:
    """
    Determine if the player's desired move is within board boundaries.

    :param board: a dictionary where keys are coordinate tuple (row, column) and values are randomly assigned room
                  names
    :param character: a dictionary with keys: "Name", "X-coordinate", "Y-coordinate", "Level", "Marks", "Sanity",
                      "Max Sanity", "Date Rejects"
    :param direction: a dictionary with movement values {"X-coordinate": int, "Y-coordinate": int}
    :precondition: board must be a dictionary where keys are coordinate tuple (row, column) and values are randomly
                   assigned room names
    :precondition: character must be a dictionary with keys: "Name", "X-coordinate", "Y-coordinate", "Level", "Marks",
                   "Sanity", "Max Sanity", "Date Rejects"
    :precondition: direction must be a dictionary with values {"X-coordinate": int, "Y-coordinate": int}
    :postcondition: determines whether the character can move without going out of bounds
    :return: True if the move is valid, False otherwise

    >>> game_board = {
    ... (0, 0): 'Room 0', (0, 1): 'Room 2', (0, 2): 'Room 2', (0, 3): 'Event Room', (0, 4): 'Empty Room',
    ... (1, 0): 'Event Room', (1, 1): 'Room 0', (1, 2): 'Event Room', (1, 3): 'Room 0', (1, 4): 'Empty Room',
    ... (2, 0): 'Empty Room', (2, 1): 'Room 0', (2, 2): 'Room 2', (2, 3): 'Room 2', (2, 4): 'Empty Room',
    ... (3, 0): 'Room 0', (3, 1): 'Room 0', (3, 2): 'Empty Room', (3, 3): 'Room 0', (3, 4): 'Empty Room',
    ... (4, 0): 'Room 2', (4, 1): 'Event Room', (4, 2): 'Empty Room', (4, 3): 'Empty Room', (4, 4): 'Room 2'
    ... }
    >>> user = {'X-coordinate': 4, 'Y-coordinate': 4, 'Sanity': 5}
    >>> desired_direction = {"X-coordinate": 1, "Y-coordinate": 0}
    >>> validate_move(game_board, user, desired_direction)
    False

    >>> game_board = {
    ... (0, 0): 'Room 0', (0, 1): 'Room 2', (0, 2): 'Room 2', (0, 3): 'Event Room', (0, 4): 'Empty Room',
    ... (1, 0): 'Event Room', (1, 1): 'Room 0', (1, 2): 'Event Room', (1, 3): 'Room 0', (1, 4): 'Empty Room',
    ... (2, 0): 'Empty Room', (2, 1): 'Room 0', (2, 2): 'Room 2', (2, 3): 'Room 2', (2, 4): 'Empty Room',
    ... (3, 0): 'Room 0', (3, 1): 'Room 0', (3, 2): 'Empty Room', (3, 3): 'Room 0', (3, 4): 'Empty Room',
    ... (4, 0): 'Room 2', (4, 1): 'Event Room', (4, 2): 'Empty Room', (4, 3): 'Empty Room', (4, 4): 'Room 2'
    ... }
    >>> user = {'X-coordinate': 2, 'Y-coordinate': 1, 'Sanity': 5}
    >>> desired_direction = {"X-coordinate": 1, "Y-coordinate": 0}
    >>> validate_move(game_board, user, desired_direction)
    True
    """
    max_x = max(x for _, x in board.keys())
    max_y = max(y for y, _ in board.keys())
    new_character_x_coordinate = character["X-coordinate"] + direction["X-coordinate"]
    new_character_y_coordinate = character["Y-coordinate"] + direction["Y-coordinate"]
    if 0 <= new_character_x_coordinate <= max_x and 0 <= new_character_y_coordinate <= max_y:
        return True
    else:
        return False



def game():
    """
    Drive the game.
    """
    rows = 5
    columns = 5
    board = make_board(rows, columns)
    character = make_character()
    achieved_goal = False
    while is_alive(character) and not achieved_goal:
        describe_current_location(board, character)
        direction = get_user_choice(character)
        valid_move = validate_move(board, character, direction)
        if valid_move:
            move_character(character, direction)
            position = (character["Y-coordinate"], character["X-coordinate"])
            if board[position] == "Event Room":
                if wants_to_date(character):
                    go_on_date(character)
                else:
                    go_back_to_work(character)
                board[position] = "Empty Room"
            else:
                ask_quiz_question(character)
            if count_event_rooms(board) == 0:
                print("SYSTEM: The space shifts around you... new path unfolds.")
                time.sleep(5)
                board = make_board(rows, columns)
        else:
            pass
            print("You can't go in that direction!")
    if not is_alive(character):
        print("SYSTEM: You collapse. There’s nothing left. Game Over.")
    elif character["Level"] == 3:
        correct = final_question(character)

        print("\nSYSTEM: Final record sealed...\n")

        if not correct:
            if character["Sanity"] <= 4:
                print("BAD ENDING 1: You vanish into noise. No one remembers.")
            else:
                print("BAD ENDING 2: You keep walking, but never find rest.")
        else:
            if character["Marks"] >= 90 and character["Sanity"] > 5:
                print("GOOD ENDING: You found it. The quiet. You are free.")
            else:
                print("BAD ENDING 3: You almost made it. But something’s missing...")

        print("\nGAME OVER.")


def main():
    """
    Drive the program.
    """
    game()


if __name__ == "__main__":
    main()

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

    >>> game_board = {(0, 0): 'Empty Room', (0, 1): 'Empty Room', (0, 2): 'Empty Room', (0, 3): 'Event Room', (0, 4): 'Empty Room',
    ... (1, 0): 'Event Room', (1, 1): 'Empty Room', (1, 2): 'Empty Room', (1, 3): 'Empty Room', (1, 4): 'Empty Room',
    ... (2, 0): 'Empty Room', (2, 1): 'Empty Room', (2, 2): 'Empty Room', (2, 3): 'Empty Room', (2, 4): 'Empty Room',
    ... (3, 0): 'Empty Room', (3, 1): 'Empty Room', (3, 2): 'Empty Room', (3, 3): 'Empty Room', (3, 4): 'Empty Room',
    ... (4, 0): 'Empty Room', (4, 1): 'Event Room', (4, 2): 'Empty Room', (4, 3): 'Empty Room', (4, 4): 'Empty Room'}
    >>> user = {'X-coordinate': 0, 'Y-coordinate': 0, 'Sanity': 5}
    >>> describe_current_location(game_board, user)
    |--+--+--+--+--+--|
    |  *        E     |
    |  E              |
    |                 |
    |                 |
    |     E           |
    |--+--+--+--+--+--|

    >>> game_board = {(0, 0): 'Empty Room', (0, 1): 'Empty Room', (0, 2): 'Empty Room', (0, 3): 'Event Room', (0, 4): 'Empty Room',
    ... (1, 0): 'Empty Room', (1, 1): 'Empty Room', (1, 2): 'Event Room', (1, 3): 'Empty Room', (1, 4): 'Empty Room',
    ... (2, 0): 'Empty Room', (2, 1): 'Empty Room', (2, 2): 'Empty Room', (2, 3): 'Empty Room', (2, 4): 'Empty Room',
    ... (3, 0): 'Empty Room', (3, 1): 'Empty Room', (3, 2): 'Empty Room', (3, 3): 'Empty Room', (3, 4): 'Empty Room',
    ... (4, 0): 'Empty Room', (4, 1): 'Event Room', (4, 2): 'Empty Room', (4, 3): 'Empty Room', (4, 4): 'Empty Room'}
    >>> user = {'X-coordinate': 4, 'Y-coordinate': 4, 'Sanity': 5}
    >>> describe_current_location(game_board, user)
    |--+--+--+--+--+--|
    |           E     |
    |        E        |
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

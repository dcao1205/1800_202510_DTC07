import random
import time
from itertools import product
from quiz_bank import quiz_bank

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

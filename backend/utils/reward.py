def calculate_reward(is_correct: bool, is_useful: bool, missed_critical: bool) -> float:
    reward = 0.0
    if is_correct:
        reward += 10.0
    else:
        reward -= 5.0
        
    if is_useful:
        reward += 5.0
        
    if missed_critical:
        reward -= 20.0
        
    return reward

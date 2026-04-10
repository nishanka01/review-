from env.code_review_env import CodeReviewEnv
from agent.dqn_agent import DQNAgent

def train_agent():
    env = CodeReviewEnv()
    agent = DQNAgent(env.state_size, env.action_size)
    batch_size = 32
    
    # Offline pre-training sequence
    for episode in range(100):
        state = env.reset("dummy code")
        # In actual offline training, we would parse a dataset of code files
        # Here we just iterate the environment step loop
        action = agent.act(state)
        next_state, reward, done = env.step(action, "dummy code")
        
        agent.remember(state, action, reward, next_state, done)
        if len(agent.memory) > batch_size:
            agent.replay(batch_size)
            
        if episode % 10 == 0:
            print(f"Episode: {episode}/100, Score: {reward}, Epsilon: {agent.epsilon:.2f}")

if __name__ == "__main__":
    print("Starting Offline DQN Training...")
    train_agent()
    print("Training Complete!")

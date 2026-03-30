# 1. 基本概念
trajectory：一条包含状态，动作，奖励的链  
return：一条trajectory的reward总和  
discounted return：无限的reward经过折扣累加 
折扣因子：无限的过程中，可以给每次的奖励乘一个折扣因子γ。这样return收敛。伽马趋近于0agent更近视，趋向于1更远视
episode（trial）：agent与环境交互，最后到达terminal state的一次过程。
continuing task：agent与环境的交互永不停止。这里把target state视作absorbing state，一旦到达永远不离开。
# 2.贝尔曼公式
bootstrapping：从一个状态得到的return是依赖于其他状态的return，这个idea就叫bootstrapping  
由此可以推导出贝尔曼公式最简单形式：v=r+γPv，其中P是一个矩阵  
$v_\pi(s)=E[G_t|S_t=s]$ state value的定义，其中Gt是一个trajectory的discounted return。与return的区别在于，state value是对多个trajectory的return求均值。注意是从s出发的trajectory  
> 推导：$$v_\pi(s)=E[G_t|S_t=s]=E[R_{t+1}|S_t=s]+\gamma E[G_{t+1}|S_t=s]$$
$$E[R_{t+1}|S_t=s]=\sum_a \pi(a|s)E[R_{t+1}|S_t=s,A_t=a]=\sum_a \pi(a|s)\sum_r p(r|s,a)r $$
$$E[G_{t+1}|S_t=s]=\sum_{s^\prime}E[G_{t+1}|S_t=s,S_{t+1}=s^\prime]p(s^\prime|s)=\sum_{s^\prime}E[G_{t+1}|S_{t+1}=s^\prime]p(s^\prime|s)=$$$$\sum_{s^\prime}v_\pi(s^\prime)p(s^\prime|s)=\sum_{s^\prime}v_\pi(s^\prime)\sum_a p(s^\prime|s,a)\pi(a|s) $$

综上：$$v_\pi(s)=\sum_a\pi(a|s)[\sum_rp(r|s,a)r+\gamma\sum_{s^\prime}p(s^\prime|s,a)v_\pi(s^\prime)] $$
$$=\sum_a\pi(a|s)q(s,a) $$
这就是贝尔曼公式，描述的是当前与未来的状态的状态价值函数之间的关系。  
## 矩阵形式
$$v_\pi=r_\pi+\gamma P_\pi v_\pi$$其中$r_\pi$为各个状态即时奖励组成的列向量，$P_\pi$为转移矩阵，每个位置元素表示从i状态转移到j状态的概率  
所以右边的$P_\pi v_\pi$代表的是其他的状态价值的回报。

为什么要求解状态价值？给出一个策略，求解策略下状态价值函数的过程叫做评估策略。  
求解方式：$$v_k=r_\pi+\gamma P_\pi v_{k+1}$$继续迭代，当k趋于无穷时趋近于解。（因为形式满足不动点，根据不动点原理可知）
## action value
定义：从一个状态出发，并且采取某一行动得到的平均return$$q_\pi(s,a)=E[G_t|S_t=s,A_t=a] $$因此有$$v_\pi(s)=\sum_a \pi(a|s)q_\pi(s,a) $$
# 3. 贝尔曼最优公式
最优策略optimal policy：在所有状态上的状态价值都高于其他所有策略  
贝尔曼最优公式：$$v_\pi(s)=\max_\pi\sum_a\pi(a|s)[\sum_rp(r|s,a)r+\gamma\sum_{s^\prime}p(s^\prime|s,a)v_\pi(s^\prime)] $$  
贝尔曼公式的策略是固定的，但贝尔曼最优公式的策略还是需要求解的。
求解时需要先求解最优策略，方法：需要使q值最大一项的权重最大，即总是选取使得q值最大的动作，其余动作概率为0  

由不动点原理，贝尔曼最优公式有唯一解
求解方法：
$$
v_{k+1} = f(v_k) = \max_{\pi} \left( r_\pi + \gamma P_\pi v_k \right), \quad k = 1, 2, 3 \dots
$$
迭代直到收敛

# 4.value iteration&policy iteration
用于求解最优策略
## value iteration
1. policy update $$
\pi_{k+1} = \arg\max_{\pi} \left( r_\pi + \gamma P_\pi v_k \right)
$$  
计算出来所有的q(s,a)，找到每个状态最大的q对应的动作，策略即每个状态选择这个动作
2. value update$$
v_{k+1} = r_{\pi_{k+1}} + \gamma P_{\pi_{k+1}} v_k
$$
根据更新的策略，计算新的v

## policy iteration
首先给定一个随机的初始策略
1. policy evaluation$$
v_{\pi_k} = r_{\pi_k} + \gamma P_{\pi_k} v_{\pi_k}
$$
计算value state来评估策略，此时也要运用到迭代
2. policy improvement$$
\pi_{k+1} = \arg\max_{\pi} \left( r_\pi + \gamma P_\pi v_{\pi_k} \right)
$$
求出一个更好的策略
## truncated policy iteration
value iteration在计算v的时候只计算一步（更新），但policy iteration在每次计算v的时候需要计算无穷多次（迭代法求不动点）。truncated policy iteration介于两者之间，计算j（1到无穷间一个数）次。

# 5. Monte Carlo
属于model-free算法，即不需要知道环境模型，比如各个状态转移分布等信息。  
MC估计，利用大数定律，用大量样本来估计平均值，进而可以用到求q(s,a)（本质期望）。
## MC basic
与policy iteration几乎相同，不同点在于策略评估时利用MC估计来求所有的q值  
几乎不可用，但是可以帮助了解概念
## MC Exploring starts
visit：在一个episode中每出现一次state，action pair叫做对他们的一次visit  
MC basic中用的是initial-visit，即每个episode只用来估计第一次出现的s，a对。但是如果把episode做截断，可以用来估计其他的s，a对，充分利用数据。这就是MC Exploring starts，一般对episode从后往前算，可以简化计算。Exploring starts指的是每个(s,a)都应作为起点生成episode。是算法的条件  
Generalized Policy Iteration(GPI)：在policy evaluation&policy improvement中不断切换
## MC $\epsilon$-greedy
利用 soft policy去掉了Exploring starts。因为每个(s,a)都有随机性转移到别的(s,a)，当episode无限长时每个(s,a)都被visit  
$\epsilon$-greedy是在exploitation和exploration中的平衡。前者指剥削，充分利用目前已知有价值的。后者指探索，会在未来有更多随机性  
MC $\epsilon$-greedy就是在MC Exploring starts的基础上，在policy improvement这一步不再是直接选择q最大的动作，而是以$\epsilon$-greedy的原则选择。  
用到了every-visit，即每个episode中每次出现相同的(s,a)都用来计算q  
# 6.stochastic approximation & stochastic gradient descent（随机近似理论与随机梯度下降）
stochastic approximation指的是一类随机，迭代的寻找方程解或优化的算法。对于函数表达式不明确的情况依旧适用，这也是强大之处。
## Robbins-Monro算法
用于寻找g(w)=0的解w*  
方法：$$
w_{k+1} = w_k - \alpha_k \tilde{g}(w_k, \eta_k)
$$
其中
$$
\tilde{g}(w_k, \eta_k)=g(w_k)+\eta_k
$$
是对g的一个带有噪音的观测，通过采样这个观测，不断迭代w  
## stochastic gradient descent
解决的问题：$$\min_w J(w)=E[f(w,X)] $$
### gradient decent（GD）
$$
w_{k+1} = w_k - \alpha_k \nabla_w \mathbb{E}[f(w_k, X)] = w_k - \alpha_k \mathbb{E}[\nabla_w f(w_k, X)]
$$
需要模型
### batch gradient decent（BGD）
$$
\mathbb{E}[\nabla_w f(w_k, X)] \approx \frac{1}{n} \sum_{i=1}^n \nabla_w f(w_k, x_i)
$$
$$
w_{k+1} = w_k - \alpha_k \frac{1}{n} \sum_{i=1}^n \nabla_w f(w_k, x_i)
$$  
不用模型，但需要数据
### stochastic gradient descent（SGD）
$$
w_{k+1} = w_k - \alpha_k \nabla_w f(w_k, x_k)
$$
相当于将GD依赖模型的部分换成随机采样。也相当于把BGD的n设为1  
BGD,SGD,MBGD,M指的是mini，每次取一部分样品，而BGD是全部n个，SGD只取一个，但MBGD取n个样品时也不一定等于BGD，因为可能重复
# temporal-difference learning时序差分学习
用一个给定的策略生成一系列s，r的序列，称为experience。利用这些数据来估计state value。TD算法做的事情就是做policy evaluation（无模型）  
## 基础算法
公式：
$$
\begin{aligned}
v_{t+1}(s_t) &= v_t(s_t) - \alpha_t(s_t)\left[v_t(s_t) - \left[r_{t+1} + \gamma v_t(s_{t+1})\right]\right], \\
v_{t+1}(s) &= v_t(s), \quad \forall s \neq s_t,
\end{aligned}
$$
$v_t(s)$指t时刻对状态s的statevalue估计值。第二个式子指没被访问到的状态value的估计值不变。  
第一个式子中$\left[r_{t+1} + \gamma v_t(s_{t+1})\right] $是target，是要靠近的值。$\left[v_t(s_t) - \left[r_{t+1} + \gamma v_t(s_{t+1})\right]\right]$则表示误差。因此总的来说t+1时刻的value是对t时刻进行一个修正。  
当vt=vπ时，td error为0，因此是把测量值向策略的value逼近的过程
Bellman expectaion equation:
$$v_\pi(s) = \mathbb{E}\left[ R + \gamma v_\pi(S') \mid S = s \right], \quad s \in \mathcal{S}.$$  
实际上就是用RM算法求解上面这个新的贝尔曼公式
TD算法是online的，得到数据立马可以进行更新。但MC是offline的，需要等采样结束才更新。
## sarsa
相较于基础算法，还能够求出action value。
$$
\begin{aligned}
q_{t+1}(s_t, a_t) &= q_t(s_t, a_t) - \alpha_t(s_t, a_t)\left[ q_t(s_t, a_t) - \left[ r_{t+1} + \gamma q_t(s_{t+1}, a_{t+1}) \right] \right], \\
q_{t+1}(s, a) &= q_t(s, a), \quad \forall (s, a) \neq (s_t, a_t).
\end{aligned}
$$
求解的是这个贝尔曼公式：
$$
q_\pi(s, a) = \mathbb{E}\left[ R + \gamma q_\pi(S', A') \mid s, a \right],
$$

sarsa只能求解action value，所以求完以后，还要进行一个动作选择（policy improvement），而且是求完后里面选取动作（贪婪）。这样才能找到最优策略。
## expected sarsa
$$
\begin{aligned}
q_{t+1}(s_t, a_t) &= q_t(s_t, a_t) - \alpha_t(s_t, a_t)\left[ q_t(s_t, a_t) - \left( r_{t+1} + \gamma \mathbb{E}[q_t(s_{t+1}, A)] \right) \right], \\
q_{t+1}(s, a) &= q_t(s, a), \quad \forall (s, a) \neq (s_t, a_t),
\end{aligned}
$$
## n-step sarsa
$$
G_t^{(n)} = R_{t+1} + \gamma R_{t+2} + \cdots + \gamma^n q_\pi(S_{t+n}, A_{t+n}),
$$
再代入贝尔曼公式，得到$$
\begin{aligned}
q_{t+1}(s_t, a_t) &= q_t(s_t, a_t) - \alpha_t(s_t, a_t)\left[ q_t(s_t, a_t) - \left[ r_{t+1} + \gamma r_{t+2} + \cdots + \gamma^n q_t(s_{t+n}, a_{t+n}) \right] \right].
\end{aligned}
$$
## Q-learning
求解的是这个贝尔曼方程：$$
q(s, a) = \mathbb{E}\left[ R_{t+1} + \gamma \max_a q(S_{t+1}, a) \mid S_t = s, A_t = a \right]
$$
算法：
$$
\begin{aligned}
q_{t+1}(s_t, a_t) &= q_t(s_t, a_t) - \alpha_t(s_t, a_t)\left[ q_t(s_t, a_t) - \left[ r_{t+1} + \gamma \max_{a \in \mathcal{A}} q_t(s_{t+1}, a) \right] \right], \\
q_{t+1}(s, a) &= q_t(s, a), \quad \forall (s, a) \neq (s_t, a_t),
\end{aligned}
$$  
on-policy:behavior策略和target策略相同，与环境交互并不断改进  
off-policy:两者不同，一个策略得到大量经验，另一个用来改进  
q-learning是off-policy的，所以存在一个behavior policy用来收集数据（一般是ε-greedy，并且不会更新）。因此他可以求解最优q值。
各种sarsa算法和q-learning的区别只在于TD target。而所有TD算法之所以长成这个形式，是因为他们都在用RM算法求解自己的贝尔曼方程。  

# value function approximation
之前的TD算法实际上隐含用一个表格记录q值，但状态空间太大时不现实。此时利用函数来近似value function。该方法更新的实际上是函数的参数，进而再得到估计的value function  
可以与sarsa或者q-learning结合。
## deep q-learning(or deep q-network，DQN)
神经网络相当于是一个函数，输入状态，输出每个动作对应的q值。训练的目标是使得q值逼近贝尔曼方程的解，即最优q值。损失函数为：
$$J(\boldsymbol{u}) = \mathbb{E}\left[ \left( R + \gamma \max_{\boldsymbol{a} \in \mathcal{A}(\mathcal{S})} q(\mathcal{S}', \boldsymbol{a}, \boldsymbol{u}) - q(\mathcal{S}, \boldsymbol{A}, \boldsymbol{u}) \right)^2 \right]$$  
有损失函数就要用梯度下降来优化参数。DQN的思想是，先固定前面的含u的q值不变，对后面的求梯度，进行更新。一段时间后再把更新的u值代入前面，再重复。前面的叫做target Network，而后面的叫做main Network。  
experience replay：每次更新时从之前的经验中随机抽取一些来更新，而不是用最新的经验。这样可以打破数据之间的相关性，增加数据的利用率。  
为什么需要经验回放？因为DQN对（s,a）的分布有要求，在没有先验经验的情况下，我们只能假设uniform distribution，所以采用经验回放。  

# policy gradient methods
用函数，而不是表格，来表示policy。输入状态，输出动作状态分布。  
## metric
也就是objective function，表示我们要最大化的东西。  
两个metric都是策略的函数，通过优化metric，可以优化θ  
两者之间有等式联系，因此一者达到极值时，另一个也会
### 1.average state value
$$
\bar{v}_\pi = \sum_{s \in S} d(s) v_\pi(s)
$$  
相当于对state value进行加权平均。关于d(s)，可能与策略独立，也可能与策略相关，相关时，求梯度也要算上d(s)的梯度。  
另一种形式：$$
\mathbb{E}\left[\sum_{t=0}^\infty \gamma^t R_{t+1}\right]
$$
### 2.average reward
$$
\bar{r}_\pi = \sum_{s \in S} d_\pi(s) r_\pi(s)
$$  
其中
$$
r_\pi(s) = \sum_{a \in A} \pi(a|s) r(s,a)
$$依赖于策略
$$
r(s,a) = \mathbb{E}[R \mid S=s,A=a] = \sum_r r \cdot p(r \mid s,a)
$$
指在（s,a）处得到的immediate reward的期望值。而上面那个是在s得到的immediate reward的期望值。再对s进行加权平均得到average reward。  
另一种表示形式：$$
\lim_{N \to \infty} \frac{1}{N} E[\sum_{t=1}^N R_{t+1}]
$$

## gradients of the metrics
$$
\begin{aligned}
\nabla_\theta J(\theta) &= \sum_{s \in S} d^\pi(s) \sum_{a \in A} \nabla_\theta \pi(a|s, \theta) q^\pi(s,a) \\
&= \mathbb{E}\left[\nabla_\theta \ln \pi(A|S, \theta) q^\pi(S,A)\right]
\end{aligned}
$$  
$$
\theta_{t+1} = \theta_t + \alpha \nabla_\theta \ln \pi(A_t|S_t, \theta_t) q_t(S_t, A_t)
$$  
如果用MC来估计q值，那么就是REINFORCE算法。

# actor-critic methods 
结合了policy gradient methods和value function approximation，一个用来更新策略，一个用来评估策略。
与REINFORCE不同在于用TD来估计q值  
actor指的是policy update，critic指的是value update（policy evaluation）。critic的作用是评估actor的表现，给出一个反馈信号来指导actor的更新。  
actor：$$
\theta_{t+1} = \theta_t + \alpha \nabla_\theta \ln \pi(A_t|S_t, \theta_t) q_t(S_t, A_t)
$$
而critic是估计$q_t(S_t, A_t)$的
## QAC
用sarsa（结合值函数估计）来做critic  
## A2C（TD actor-critic）
$$
\theta_{t+1} = \theta_t + \alpha \nabla_\theta \ln \pi(A_t|S_t, \theta_t) (q_t(S_t,A_t) - v_t(S_t))
$$
由于偏置量不影响期望，因此可以把q换成TD target，这样可以减小方差，拟合更精确。
## off-policy actor-critic
### importance sampling
可以把on-policy的方法转换为off-policy的方法。  
$$
\mathbb{E}_{x \sim p_0}[x] = \sum_x p_0(x) x = \sum_x p_1(x) \frac{p_0(x)}{p_1(x)} x = \mathbb{E}_{x \sim p_1}\left[f(x) x\right]
$$  
因此
$$
\mathbb{E}_{x \sim p_0}[f(x)] = \frac{1}{n} \sum_{i=1}^n f(x_i) = \frac{1}{n} \sum_{i=1}^n \frac{p_0(x_i)}{p_1(x_i)} f(x_i)
$$
### 算法
$$
\nabla_\theta J(\theta) = \mathbb{E}_{\pi_\theta}\left[ \frac{\pi_\theta(A|S,\theta)}{\pi_{\text{old}}(A|S)} \nabla_\theta \ln \pi_\theta(A|S,\theta) \left( q_\theta(S,A) - \bar{v}_\theta(S) \right) \right]
$$  
$$
\theta_{t+1} = \theta_t + \alpha \rho_\theta\left(\frac{s_t, s_{t+1}, a_t}{\beta(a_t, s_t)}\right) \nabla_\theta \ln \pi_\theta(A_t|S_t, \theta_t)
$$
## deterministic policy gradient（DPG）
有时候动作空间是连续的，无法枚举所有动作来求最大q值，此时可以用DPG。
deterministic policy：$a=\mu(s,\theta) =\mu(s)$。输入s，直接输出a动作本身。
$$
\begin{aligned}
\nabla_\theta J(\theta) &= \sum_{s \in S} \rho_\mu(s) \nabla_\theta v_\mu(s) \sum_{a} q_\mu(s,a) (a - \mu(s)) \\
&= \mathbb{E}_{s \sim \rho_\mu}\left[ \nabla_\theta v_\mu(s) \nabla_a q_\mu(s,a) \big|_{a=\mu(s)} \right]
\end{aligned}
$$

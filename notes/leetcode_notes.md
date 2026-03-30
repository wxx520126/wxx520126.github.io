# c++基础知识
## string
#include<string>
定义：string s

逐个字符处理：
1. for(int i=0;i<s.size();i++)
2. for (char &c : s)其中char表示取出的每个元素的类型，&c表示对每个字符的别名，如果不加&，相当于处理副本，原字符串没有改变。s表示被处理的可迭代对象。该方法可用于其他类型的可迭代对象。

类型转换：
stoi()把string转换为int
to_string()把其他转换为string

字符串拼接：string可以直接用'+'拼接，也可以拼接char类型，但是char类型之间不行

库函数：
s.substr(a,b)：从下标a开始节选b个字符，直接替换原字符串
s.insert(a, str)：在下标为a的字符后面插入str字符串
s.find(str)：返回值是size_t类型（无符号整数），若未找到返回string::npos（一个特殊的常量，表示不存在）


输入一整行：getline(cin,s);

## vector
#include<vector>
定义：vector<int> v(lenth,initial)长度和初始值

常见定义：
vector<int> a; 空数组
vector<int> b(n); 长度为n，元素默认初始化为0（int类型）
vector<int> c(n, x); 长度为n，所有元素初始化为x
vector<int> d = {1,2,3}; 直接赋初值

常用操作：
v.push_back(x); 在末尾插入x
v.pop_back(); 删除末尾元素（非空时使用）
v.size(); 返回元素个数（返回值是size_t）
v.empty(); 判空，空返回true
v.clear(); 清空所有元素

访问元素：
v[i] 下标访问（不检查越界）
v.at(i) 下标访问（会检查越界）
v.front() 第一个元素
v.back() 最后一个元素

遍历方式：
1. for(int i=0;i<v.size();i++)
2. for (int x : v) 只读遍历
3. for (int &x : v) 可修改原数组元素

插入与删除（中间位置）：
v.insert(v.begin()+pos, x); 在pos位置前插入x
v.erase(v.begin()+pos); 删除pos位置元素
v.erase(v.begin()+l, v.begin()+r); 删除区间[l,r)元素

配合algorithm：
#include<algorithm>
sort(v.begin(), v.end()); 升序排序
sort(v.rbegin(), v.rend()); 降序排序
reverse(v.begin(), v.end()); 反转。begin后面+i表示从下标为i元素开始，同样可以用于字符串。注意！reverse左闭右开

去重套路（先排序再unique）：
sort(v.begin(), v.end());
v.erase(unique(v.begin(), v.end()), v.end());

二维vector：
vector<vector<int>> g(n, vector<int>(m, 0)); n行m列，初值0

返回时可以用大括号里放元素的形式返回：return {a,b,c....}

## stack
#include<stack>
定义：stack<int> st

常用操作：
st.push(x);     将元素x压入栈顶
st.pop();       弹出栈顶元素（不返回值，栈非空时使用）
st.top();       返回栈顶元素（不弹出）
st.empty();     判空，空返回true
st.size();      返回元素个数

注意事项：
- 栈不支持遍历，不能用下标访问
- pop()前必须确保栈非空，否则行为未定义
- 只能操作栈顶元素（LIFO，后进先出）

常见使用套路：
// 依次处理栈顶元素
while (!st.empty()) {
    int x = st.top();
    st.pop();
    // 处理 x
}

单调栈：维护一个单调的栈。当找到需求的元素时就栈顶出栈，否则存储。

## queue
#include<queue>
定义：queue<int> q

常用操作：
q.push(x);     将元素x加入队尾
q.pop();       弹出队头元素（不返回值，队列非空时使用）
q.front();     返回队头元素（不弹出）
q.back();      返回队尾元素（不弹出）
q.empty();     判空，空返回true
q.size();      返回元素个数

注意事项：
- 队列不支持下标访问，也不支持随机访问
- pop()和front()前必须确保队列非空，否则行为未定义
- queue是FIFO（先进先出）

常见使用套路：
// 依次处理队头元素
while (!q.empty()) {
    int x = q.front();
    q.pop();
    // 处理 x
}

补充：
priority_queue是优先队列（默认大根堆），常用于快速取当前最大/最小值。

## deque
#include<deque>
定义：deque<int> dq

常用操作：
dq.push_back(x);    在队尾插入x
dq.push_front(x);   在队头插入x
dq.pop_back();      删除队尾元素（不返回值，非空时使用）
dq.pop_front();     删除队头元素（不返回值，非空时使用）
dq.front();         返回队头元素
dq.back();          返回队尾元素
dq[i];              下标访问第i个元素（支持随机访问）
dq.size();          返回元素个数
dq.empty();         判空
dq.clear();         清空

和queue的核心区别：
- queue是容器适配器，默认底层通常就是deque；queue只暴露“队头出、队尾进”这组FIFO接口
- deque是顺序容器，本体可直接操作两端，也支持下标随机访问
- queue不支持下标访问和遍历迭代器；deque支持下标访问与常规遍历
- queue的功能更受限但语义更明确（就是队列）；deque更灵活，既能当队列，也能当双端队列

什么时候用谁：
- 只需要标准FIFO语义（如BFS），优先用queue，代码意图更清晰
- 需要两端都增删，或需要随机访问，使用deque

常见使用套路：
// 双端处理
while (!dq.empty()) {
    int l = dq.front();
    int r = dq.back();
    if (l == r) {
        dq.pop_front();
        if (!dq.empty()) dq.pop_back();
    } else {
        break;
    }
}

## unordered_map
#include<unordered_map>
定义：unordered_map<KeyType, ValueType> mp

常见定义：
unordered_map<int, int> cnt;                  key是int，value是int
unordered_map<string, int> freq;              统计字符串出现次数
unordered_map<char, vector<int>> pos;         key对应多个值

常用操作：
mp[key]++;                    key不存在会先创建，默认值为0
mp[key] = value;              修改或插入
mp.insert({key, value});      插入键值对（key已存在则不覆盖）
mp.erase(key);                删除key
mp.count(key);                判断key是否存在，返回0或1
mp.find(key);                 返回迭代器，找不到则是mp.end()
mp.size();                    键值对数量
mp.empty();                   判空
mp.clear();                   清空

遍历方式：
for (auto &p : mp) {
    // p.first 是 key, p.second 是 value
}

for (auto it = mp.begin(); it != mp.end(); it++) {
    // it->first 是 key, it->second 是 value
}

常见用法：
1. 计数：cnt[x]++
2. 判重：if (mp.count(x))
3. 记录位置：mp[val] = index
4. 两数之和常用：先查找 target-nums[i] 是否存在，再插入当前值

注意事项：
- unordered_map 底层是哈希表，查找/插入/删除平均时间复杂度O(1)
- 元素无序，遍历顺序不固定
- 如果只想判断是否存在，优先用find/count，避免误用mp[key]导致自动插入

## unordered_set
#include<unordered_set>
定义：unordered_set<int> s
unordered_set<int> nums(nums1.begin(),nums1.end());可以把nums1中的元素直接放入unordered_set中，达到去重的效果

常见定义：
unordered_set<int> s;                         空集合
unordered_set<string> s = {"a", "b", "c"};   直接赋初值

常用操作：
s.insert(x);              插入元素x（已存在则不重复插入）
s.erase(x);               删除元素x
s.count(x);               判断x是否存在，返回0或1
s.find(x);                返回迭代器，找不到返回s.end()
s.size();                 元素个数
s.empty();                判空
s.clear();                清空所有元素
return vector<int>(ans.begin(), ans.end());可以把ans这个unordered_set中的元素直接放入vector中并返回

遍历方式：
for (int x : s) {
    // 处理元素 x
}

for (auto it = s.begin(); it != s.end(); it++) {
    // *it 是元素值
}

常见用法：
1. 去重：用set自动去重
2. 判重：if (s.count(x)) 检查是否已出现过
3. 快速查询：set比数组查询更快（O(1) vs O(n)）
4. 两个集合的交集/并集/差集

注意事项：
- unordered_set 底层是哈希表，查找/插入/删除平均时间复杂度O(1)
- 元素无序，遍历顺序不固定
- 自动去重，不能存储重复元素
- 如果需要元素有序，使用set（红黑树实现，O(log n)）
- 插入已存在的元素时，不会报错，只是不会重复插入

## pair
#include<utility>
定义：pair<T1, T2> p


常见定义：
pair<int, int> p1;                默认初始化
pair<int, string> p2 = {1, "ok"};
pair<int, int> p3(3, 5);
auto p4 = make_pair(10, 20);      自动推导类型

访问元素：
p.first      第一个元素
p.second     第二个元素

常用操作：
p = {a, b};                       整体赋值
swap(p.first, p.second);          交换两个成员

比较规则（字典序）：
- 先比较first，first小则pair小
- first相等时比较second
- 因此pair可直接用于sort、set、map的键

配合排序：
vector<pair<int,int>> v;
sort(v.begin(), v.end());         默认按first升序，再按second升序

若要按second排序可写自定义比较：
sort(v.begin(), v.end(), [](const pair<int,int>& a, const pair<int,int>& b){
    if (a.second != b.second) return a.second < b.second;
    return a.first < b.first;
});

常见用法：
1. 同时返回两个值：return {x, y}
2. 存坐标/边：pair<int,int> 表示(x,y)或(u,v)
3. 与map配合：map<int,int>遍历时元素类型是pair<const int,int>
4. 与优先队列配合：priority_queue<pair<int,int>> 常用于按第一关键字取最大值


## 其他
<iostream>包含max，min内置函数，用于选取两者间较大较小者

# 刷题收获

## 数组

### 二分查找
实际上是在逐步排除不可能的区间，所以是不会漏解的。做题时先给自己确定好左右区间的定义，是左右闭区间，还是左闭右开。如果是左右闭区间，需要更新时记得移一位，例如left=mid+1，否则当left==mid会死循环。整体思想可参考34题，包含重复元素的情况，集大成者。常用mid = left + (right - left) / 2避免溢出。

### 移除元素
数组中的删除元素，实际上是覆盖。暴力做法是双循环，遇到需要删除的元素时，把后面所有的元素往前面移动。还可以用双指针的方法，快慢指针也可以理解为read和write，read到需要删除的元素时就跳过，读到不需要删除的元素时就把他写入write的位置。

### 滑动窗口
滑动窗口也是一种双指针。核心是维护一个区间，区间内满足题目要求。每次移动右边界扩大区间，直到不满足要求时移动左边界缩小区间。常用来解决字符串或数组中满足某些条件的最长/最短子串/子数组问题。
需要注意区分和暴力的区别。暴力的左边框固定，右边框每次都从左边开始一直到末尾。而滑动窗口的左右边框是一起往右走的，不满足条件时左边收缩，满足条件时右边持续移动

### 螺旋矩阵
思路不难，但是边界条件要好好处理，这也是面试高频的原因。

### 前缀和
前缀和是一个非常有用的技巧，可以在O(1)时间内计算任意区间的和。前缀和数组prefixSum[i]表示原数组前i个元素的和，那么任意区间[i,j]的和就可以通过prefixSum[j+1] - prefixSum[i]来计算。

## 链表
定义：
```c++
struct ListNode{
    int val;
    ListNode* next;
    ListNode(int x) : val(x),next(nullptr){}
};
```
这里val是节点存储的值，next是指向下一个listnode的指针。最下面的是构造和函数，表示创建对象时，初始化val值为x，next为nullptr
定义：
```c++ 
ListNode* head = new ListNode(5);
```
new会返回指针，所以需要指针类型变量接收。

虚拟头节点更深的内涵在于：使得头节点去特殊化。把所有的节点进行统一处理。
### 删除链表元素
203题。链表中删除元素流程：临时节点存储待删除的节点、将上一个节点指向待删除节点的下一个节点、删除临时节点。
方法包括先把头节点往后移一位和虚拟头节点两种方法。注意任何时候访问之前要先判断指针是否为空。

### 设计链表
访问前一定先检验是否为nullptr
遍历到尾节点可以用下一个是否是nullptr来判断

### 反转链表
使用两个指针沿着链表移动，然后逐个反转指向。
也可以用栈解决这种反转问题。

### 两两交换链表元素
模拟行为。重点在于把图画好，画好以后怎么样都能做出来，记得建立临时变量防止节点丢失。

### 删除倒数第n个节点
双指针法，利用两个指针的步数差来确定倒数第n个，其中注意慢指针要指向待删节点的上一个节点。

### 环形链表
一些数学技巧。没有思路时不妨试着从数学角度推导一下

## 哈希表
思想是将一些元素映射到一些值上，达到快速查询的目的。

### 有效的字母异位词
一个简单的哈希思想，用数组对应的位置存储字符的值

### 两个数组的交集
使用unordered_set，集合有去重功能。

### 两数之和
存储和查找元素没必要分开成两个for循环，这样反而在target/2这个数这里会错误。可以采用先查找再存储

### 三数之和&四数之和
排序+双指针。先固定一个数，然后用双指针在剩下的数中寻找满足条件的组合。注意去重的方法。

## 字符串

### 反转字符串
基础实现用双指针。学会用reverse。

### 数组填充类问题
用双指针，且一般都是先申请足够的空间，再从后往前填充，可以降低数组移动的复杂度。

### 翻转字符串单词
整体反转+单词反转。这种反转再反转的思想在别的地方可能也有用到，比如右旋字符串。注意空格的去除，采用双指针法，一个读入一个写入。注意内置reverse函数左闭右开

### kmp算法
这里关于前缀表遇到不匹配的情况时进行回退这一操作还没有理解，先留白

## 栈和队列

### 栈实现队列
分为输入栈和输出栈。关键在于每次输出时，把输入栈已存的所有元素放入输出栈，防止顺序错乱

### 队列实现栈
两个队列，一个模拟栈，另一个做副本。每次输出时复制到副本，输出后再全部挪回来
也可以只用一个队列，有数据出队时，循环把队头元素挪到队尾，直到只剩一个元素，这个元素就是栈顶元素了

### 有效的括号
匹配问题。小技巧：左括号就入栈一个右括号，这样后面只需要判断是否相等就OK。

### 滑动窗口最大值
用双向队列实现。维护一个单调队列，使得最大值永远在入口处。

### 前k个高频元素
topk问题，涉及到堆，后面来看

## 二叉树
定义：
```c++
struct TreeNode{
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x):val(x),left(nullptr),right(nullptr){}
}
```

### 遍历

#### 深度优先遍历
深度优先遍历包括前中后序，表示根节点是前中后哪个位置。通过递归来实现。

写递归要确定：
1. 传入参数和返回值
2. 终止条件
3. 单层逻辑
实现代码：
```c++
void traversal(TreeNode* cur,vector<int>& ans){
    if(cur==nullptr)return;
    ans.push_back(cur->val);
    traversal(cur->left,ans);
    traversal(cur->right,ans);
}
```
中序和后序只是更改最后三行代码顺序。

也可以通过栈，用迭代实现。
前序遍历：
根节点先入栈，出栈时记录节点值，然后右孩子先入栈，左孩子后入栈，这样出栈时就是先左后右了。
```c++
vector<int> preorderTraversal(TreeNode* root) {
        vector<int> ans;
        stack<TreeNode*> st;
        if(root==nullptr)return ans;
        st.push(root);
        while(!st.empty()){
            TreeNode* tmp=st.top();
            st.pop();
            ans.push_back(tmp->val);
            if(tmp->right)st.push(tmp->right);
            if(tmp->left)st.push(tmp->left);
            
        }
}
```

中序遍历：
处理（把值存入数组）与访问（遍历节点）的顺序不同，所以通过一个栈来模拟处理的过程。用指针来访问。
先访问到底层，再一层层回退直到找到存在右节点的节点。
```c++
vector<int> inorderTraversal(TreeNode* root) {
        vector<int> ans;
        stack<TreeNode*> st;
        TreeNode* cur=root;
        while(cur||!st.empty()){
            if(cur){
                st.push(cur);
                cur=cur->left;
            }
            else{
                cur=st.top();
                st.pop();
                ans.push_back(cur->val);
                cur=cur->right;
            }  
        }
        return ans;
    }
```

后序遍历：
模仿前序遍历，改变入栈顺序，并且最后整体反转
```c++
vector<int> postorderTraversal(TreeNode* root) {
        vector<int> ans;
        stack<TreeNode*> st;
        if(root==nullptr)return ans;
        st.push(root);
        while(!st.empty()){
            TreeNode* tmp=st.top();
            st.pop();
            ans.push_back(tmp->val);
            if(tmp->left)st.push(tmp->left);
            if(tmp->right)st.push(tmp->right);
        }
        reverse(ans.begin(),ans.end());
        return ans;
    }
```

三种遍历方式也有一种风格统一的迭代写法，但是较难理解，这里先不管


#### 广度优先遍历
即层序遍历。通过队列实现，每次都把当前层的节点出队并记录，并且让下一层节点依次入队。注意size，q.size()会随时变化，因此不能判断是否出队完毕。

```c++
vector<vector<int>> levelOrder(TreeNode* root) {
        vector<vector<int>> ans;
        if(!root)return ans;
        queue<TreeNode*> q;
        q.push(root);
        while(!q.empty()){
            int size=q.size();
            vector<int> v;
            for(int i=0;i<size;i++){
                TreeNode* tmp=q.front();
                q.pop();
                v.push_back(tmp->val);
                if(tmp->left)q.push(tmp->left);
                if(tmp->right)q.push(tmp->right);
            }
            ans.push_back(v);
        }
        return ans;
    }
```

递归实现方法：
确定传入参数，重点是depth，是为了标注当前层存入的位置。终止条件即节点为空。单层逻辑是判断是否需要扩容，然后再把当前节点存入ans数组，再递归访问左右子树。
```c++
void order(TreeNode* cur,vector<vector<int>>& ans,int depth){
        if(!cur)return;
        if(depth==ans.size())ans.push_back(vector<int> ());
        ans[depth].push_back(cur->val);
        order(cur->left,ans,depth+1);
        order(cur->right,ans,depth+1);
    }
    vector<vector<int>> levelOrder(TreeNode* root) {
        int depth=0;
        vector<vector<int>> ans;
        order(root,ans,depth);
        return ans;
    }
```
### 翻转二叉树
可以用递归来做，也可以在前面讲的遍历的基础上修改，访问节点时交换。

### 对称二叉树
判断二叉树是否对称，最简单的办法是沿用上一题思路，判断左右子树是否是翻转后相等
也可以用迭代法，用队列或者栈来遍历。先后把左右需要比较的节点放入容器，然后逐一比较。

### 二叉树最大深度
深度从上往下递增，高度从上往下递减。
求最大深度可以用递归法：
后序遍历，先求左右子树深度，再加一返回
前序遍历：维护一个全局变量result。每次getdepth时先更新result，然后depth++再getdepth，结束后--（体现回溯）

也可以用之前的层序遍历快速解决。
最小深度同理，遇到叶子结点直接返回深度

### 平衡二叉树
前序遍历是从上往下（深度），后序遍历是从下往上（高度）
这里就采用后序遍历
递归法：
定义一个递归的求高度函数，注意可以判断是否已经不平衡，如果已经不平衡，传递-1。

### 二叉树的所有路径
前序遍历。递归加回溯，递归深入底层，回溯回到上一个节点。
如果是迭代法，需要两个栈分别存储节点和路径。每个循环进行出栈，如果是叶子节点就把路径添加入答案

### 左叶子之和
采用后序遍历，把左右子树的左叶子之和加起来还给父节点，然后递归下去。
注意使用递归时，不能判断当前节点是否为左叶子（左叶子判断依赖于父节点），所以需要特殊处理左叶子情况

迭代法就是正常用栈前序遍历，遇到左叶子就计入sum

### 最左下角的值
递归法：可用前序遍历，注意记录深度，当深度大于最大深度时，记录节点值（因为前序遍历一定会先遍历最左边的节点，因此这个就一定是左下角值）。与深度有关递归回溯时，记得++和--。
迭代法：简单的层序遍历

### 路径之和
递归法：递归加回溯，
迭代法：依旧前序遍历，用栈迭代，栈里每个元素为pair，两个元素分别为当前节点以及路径到当前节点的和

路径之和2需要还需要记录路径，可以维护一个path向量，这个向量也要跟着进行递归与回溯

### 中序与后序构造二叉树
跳过

### 最大二叉树
与上一题一样是二叉树构造问题。采用递归，这里记录数组的最大值，再以最大元素为界分成两部分递归构造。

### 合并二叉树
递归法较简单，终止条件：遇到空节点，返回另一个。单层逻辑：节点值相加，递归左右子树。传入参数两个节点，返回一个节点
迭代法维护队列存储两棵树的节点，并且就在第一颗树上做更改。

### 二叉搜索树中搜索
二叉搜索树具有性质：
若它的左子树不空，则左子树上所有结点的值均小于它的根结点的值；
若它的右子树不空，则右子树上所有结点的值均大于它的根结点的值；
它的左、右子树也分别为二叉搜索树

因此递归法很简单，可以比较当前节点值与待搜索值确定搜索方向
迭代法也很简单，根据当前节点确定搜索反向，甚至不需要辅助容器

### 验证二叉搜索树
性质：用中序遍历，得到的结果是一个升序数组。因此可以中序遍历构造数组再判断是否递增。

### 二叉搜索树最小绝对差
可以利用中序遍历得到升序数组的性质直接做
也可以边遍历边计算，用一个pre记录上一个节点。

迭代法：利用两个指针，一个指向前一个节点，另一个为当前节点。

### 二叉搜索树中的众数
递归：单层逻辑：判断当前节点值与前一个节点值是否相等，相等则count++，不相等则count=1。每次更新maxCount和结果数组。
迭代法也类似

### 二叉树公共祖先
。。。。做不下去了


## 回溯
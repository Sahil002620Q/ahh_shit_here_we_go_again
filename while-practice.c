#include <stdio.h>
int main ()
{
    int n = 0;
    while(n<=5)
    {
        printf("%d\n",n);
         //for incriment by 1 number we can use either n = n+1 or n++
         n++;
    }
}

//✔ n = n + 1
//✔ n++ (post-increment)
//✔ ++n (pre-increment)   ie if n = 0 then n wil be printed 1 directly
#include <stdio.h>
int main () {
    int myNumbers[3] = {10, 20, 30};
int *p = myNumbers;
p++;
printf("%d\n",*p);
p--;
printf("%d\n",*p);
p += 2;
printf("%d\n",*p);
}
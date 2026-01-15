#include <stdio.h>
int main () {
    int arr[4] = {21,43,54,76};
    int *p = arr;
printf("%d\n",*p);    
printf("%d\n",*(p+1));
printf("%d\n",*(p+2));
printf("%d\n",*(p+3));
}
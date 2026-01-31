#include <stdio.h>
 int main () {
    int arr[4] = {32,65,32,64};
    int *p  = arr;
   for(int i =0 ; i <4 ; i++){
      printf(" %d",*p);
      p++;
   }
   }
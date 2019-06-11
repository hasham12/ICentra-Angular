import { environment } from '../../environments/environment';

export class Utils {

    static hosturl: any = environment.baseUrl;

    static getBaseURL(baseurl: any) {
        if(baseurl.indexOf(this.hosturl) == -1) {
            baseurl = this.hosturl + baseurl;
        }
        return baseurl;
    }
    
    static randomId() {
        return Math.floor(Math.random() * 999999) + 1;
    }

    static calculateAspectRatioFit(newWidth: number, newHeight: number, orgWidth:number, orgHeight: number) {
        //var ratio = orgWidth / orgHeight;
        return {
            width: newWidth,
            height: newHeight
        };
    }

    /**
     * @description
     * Replace all occurances of the sub string.
     *
     * @param  {String}  key
     * @param  {Boolean} reverse
     * @return {Function}
     */
    static replaceAll = (string, search, replacement) => {
      return string.split(search).join(replacement);
    };

    /**
     * @description
     * Returns a function which will sort an
     * array of objects by the given key.
     *
     * @param  {String}  key
     * @param  {Boolean} reverse
     * @return {Function}
     */
    static sortBy = (key, reverse) => {

      // Move smaller items towards the front
      // or back of the array depending on if
      // we want to sort the array in reverse
      // order or not.
      const moveSmaller = reverse ? 1 : -1;

      // Move larger items towards the front
      // or back of the array depending on if
      // we want to sort the array in reverse
      // order or not.
      const moveLarger = reverse ? -1 : 1;

      /**
       * @param  {*} a
       * @param  {*} b
       * @return {Number}
       */
      return (a, b) => {
        if (a[key] < b[key]) {
          return moveSmaller;
        }
        if (a[key] > b[key]) {
          return moveLarger;
        }
        return 0;
      };
    };
}
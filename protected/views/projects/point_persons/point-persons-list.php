<div id="point-persons-list">
    <form>
        <input type="hidden" id="point-persons-list-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
        <div class="contact-info-details">
            <!-- header -->
            <div class="section primary-info expanded">
                <div id="expand-primary" class="header">
                    <h3><b>Point Persons</b></h3>&nbsp&nbsp
                    <a id="point-persons-list-create-button" href="#">[Add]</a>
                </div>
            </div>
            <!-- body -->
            <div id="edit-primary-content" class="content">
                <table>
                    <thead>
                        <tr>                      
                            <th width=''>Name</th>
                            <th width=''>User Group</th>
                        </tr>
                    </thead>
                    <tbody id="point-persons-list-table">
                    </tbody>
                </table>
                <div class="page-nav">
                    <div class="page-count">
                        <span class="current-page" id="point-persons-list-part"></span>
                        <span class="all-page" id="point-persons-list-total"></span>
                    </div>
                    <div class="page-nav-arrow">
                        <a id="point-persons-list-prev" class="prev" href="#" title="Previous"><span class="icon"></span></a>
                        <a id="point-persons-list-next" class="next" href="#" title="Next"><span class="icon"></span></a>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>